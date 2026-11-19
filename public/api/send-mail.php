<?php
// E-Connect Automated Secure Mail Relay Gateway
// Hosted on Hostinger LiteSpeed PHP for econnecthub.com
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput, true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

// Authenticate via shared secret token
$expectedSecret = 'eseva_super_secret_jwt_key_2026';
$providedSecret = $_SERVER['HTTP_X_MAIL_KEY'] ?? ($payload['secret'] ?? '');

if ($providedSecret !== $expectedSecret) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Unauthorized mail relay request']);
    exit;
}

$to = trim($payload['to'] ?? 'econnectshopping@gmail.com');
$subject = trim($payload['subject'] ?? 'E-Connect Notification');
$html = $payload['html'] ?? '';
$text = $payload['text'] ?? strip_tags($html);
$replyTo = trim($payload['replyTo'] ?? '');
$fromEmail = 'econnectshopping@gmail.com';
$fromName = 'EConnect Digital Services';
$attachments = is_array($payload['attachments'] ?? null) ? $payload['attachments'] : [];

$messageId = '<' . uniqid('econnect_', true) . '@econnecthub.com>';

// Helper function to send via Google SMTP socket over SSL port 465
function sendViaGoogleSmtp($to, $subject, $html, $text, $attachments, $replyTo, $messageId) {
    $smtpUser = 'econnectshopping@gmail.com';
    $smtpPass = 'kvqpwazifoeucizf';
    $host = 'ssl://smtp.gmail.com';
    $port = 465;

    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'allow_self_signed' => false
        ]
    ]);

    $socket = @stream_socket_client("$host:$port", $errno, $errstr, 12, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        return ['ok' => false, 'error' => "Socket error: $errstr ($errno)"];
    }

    stream_set_timeout($socket, 15);

    $read = function() use ($socket) {
        $data = '';
        while ($str = fgets($socket, 515)) {
            $data .= $str;
            if (substr($str, 3, 1) === ' ') break;
        }
        return $data;
    };

    $write = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $res = $read();
    if (substr($res, 0, 3) !== '220') {
        fclose($socket);
        return ['ok' => false, 'error' => "Banner: $res"];
    }

    $write("EHLO econnecthub.com");
    $res = $read();

    $write("AUTH LOGIN");
    $res = $read();
    if (substr($res, 0, 3) !== '334') {
        fclose($socket);
        return ['ok' => false, 'error' => "AUTH LOGIN: $res"];
    }

    $write(base64_encode($smtpUser));
    $res = $read();
    if (substr($res, 0, 3) !== '334') {
        fclose($socket);
        return ['ok' => false, 'error' => "AUTH USER: $res"];
    }

    $write(base64_encode($smtpPass));
    $res = $read();
    if (substr($res, 0, 3) !== '235') {
        fclose($socket);
        return ['ok' => false, 'error' => "AUTH PASS: $res"];
    }

    $write("MAIL FROM:<$smtpUser>");
    $res = $read();
    if (substr($res, 0, 3) !== '250') {
        fclose($socket);
        return ['ok' => false, 'error' => "MAIL FROM: $res"];
    }

    $recipients = array_filter(array_map('trim', explode(',', $to)));
    foreach ($recipients as $rcpt) {
        $write("RCPT TO:<$rcpt>");
        $res = $read();
        if (substr($res, 0, 3) !== '250') {
            fclose($socket);
            return ['ok' => false, 'error' => "RCPT TO $rcpt: $res"];
        }
    }

    $write("DATA");
    $res = $read();
    if (substr($res, 0, 3) !== '354') {
        fclose($socket);
        return ['ok' => false, 'error' => "DATA: $res"];
    }

    $boundary = "==Multipart_Boundary_x" . md5(time()) . "x";
    $altBoundary = "==Alt_Boundary_y" . md5(time()) . "y";

    $headers = [];
    $headers[] = "From: =?UTF-8?B?" . base64_encode("EConnect Digital Services") . "?= <$smtpUser>";
    $headers[] = "To: $to";
    if ($replyTo) {
        $headers[] = "Reply-To: $replyTo";
    }
    $headers[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
    $headers[] = "Date: " . date('r');
    $headers[] = "Message-ID: $messageId";
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: multipart/mixed; boundary=\"$boundary\"";

    $body = implode("\r\n", $headers) . "\r\n\r\n";
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: multipart/alternative; boundary=\"$altBoundary\"\r\n\r\n";

    $body .= "--$altBoundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($text)) . "\r\n";

    if ($html) {
        $body .= "--$altBoundary\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($html)) . "\r\n";
    }
    $body .= "--$altBoundary--\r\n\r\n";

    foreach ($attachments as $att) {
        $attName = $att['filename'] ?? 'document.pdf';
        $attType = $att['contentType'] ?? 'application/octet-stream';
        $attBase64 = $att['content'] ?? '';

        if (!empty($attBase64)) {
            $body .= "--$boundary\r\n";
            $body .= "Content-Type: $attType; name=\"$attName\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= "Content-Disposition: attachment; filename=\"$attName\"\r\n\r\n";
            $body .= chunk_split($attBase64) . "\r\n";
        }
    }

    $body .= "--$boundary--\r\n";
    $body .= "\r\n.";

    $write($body);
    $res = $read();
    if (substr($res, 0, 3) !== '250') {
        fclose($socket);
        return ['ok' => false, 'error' => "DATA send: $res"];
    }

    $write("QUIT");
    $read();
    fclose($socket);

    return ['ok' => true, 'provider' => 'GOOGLE_SMTP_SOCKET', 'messageId' => $messageId];
}

// Helper function to send via standard PHP mail() with MIME multipart
function sendViaPhpMail($to, $subject, $html, $text, $attachments, $replyTo, $messageId) {
    $from = 'econnectshopping@gmail.com';
    $boundary = "==Multipart_Boundary_x" . md5(time()) . "x";
    $altBoundary = "==Alt_Boundary_y" . md5(time()) . "y";

    $headers = [];
    $headers[] = "From: EConnect Digital Services <$from>";
    if ($replyTo) {
        $headers[] = "Reply-To: $replyTo";
    }
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Message-ID: $messageId";
    $headers[] = "Content-Type: multipart/mixed; boundary=\"$boundary\"";

    $body = "--$boundary\r\n";
    $body .= "Content-Type: multipart/alternative; boundary=\"$altBoundary\"\r\n\r\n";

    $body .= "--$altBoundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($text)) . "\r\n";

    if ($html) {
        $body .= "--$altBoundary\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($html)) . "\r\n";
    }
    $body .= "--$altBoundary--\r\n\r\n";

    foreach ($attachments as $att) {
        $attName = $att['filename'] ?? 'document.pdf';
        $attType = $att['contentType'] ?? 'application/octet-stream';
        $attBase64 = $att['content'] ?? '';

        if (!empty($attBase64)) {
            $body .= "--$boundary\r\n";
            $body .= "Content-Type: $attType; name=\"$attName\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= "Content-Disposition: attachment; filename=\"$attName\"\r\n\r\n";
            $body .= chunk_split($attBase64) . "\r\n";
        }
    }

    $body .= "--$boundary--\r\n";

    $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
    $sent = @mail($to, $encodedSubject, $body, implode("\r\n", $headers));
    if ($sent) {
        return ['ok' => true, 'provider' => 'PHP_MAIL', 'messageId' => $messageId];
    }
    return ['ok' => false, 'error' => 'PHP mail() function returned false'];
}

// 1. Try Google SMTP socket via Hostinger first
$smtpResult = sendViaGoogleSmtp($to, $subject, $html, $text, $attachments, $replyTo, $messageId);
if ($smtpResult['ok']) {
    echo json_encode([
        'success' => true,
        'provider' => $smtpResult['provider'],
        'messageId' => $smtpResult['messageId'],
        'to' => $to,
        'subject' => $subject
    ]);
    exit;
}

// 2. Fall back to PHP mail()
$mailResult = sendViaPhpMail($to, $subject, $html, $text, $attachments, $replyTo, $messageId);
if ($mailResult['ok']) {
    echo json_encode([
        'success' => true,
        'provider' => $mailResult['provider'],
        'messageId' => $mailResult['messageId'],
        'to' => $to,
        'subject' => $subject,
        'smtpFallbackNotice' => $smtpResult['error']
    ]);
    exit;
}

http_response_code(500);
echo json_encode([
    'success' => false,
    'error' => 'All delivery providers failed on Hostinger',
    'smtpError' => $smtpResult['error'],
    'phpMailError' => $mailResult['error']
]);

