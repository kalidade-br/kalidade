<?php
/**
 * ZARCHIVER FILE MANAGER
 * Layout Verde estilo ZArchiver
 * Single File. Complete. Mobile-First.
 */
session_start();

/* ================= CONFIGURATION ================= */
$CONFIG = [
    'user' => 'suasenha',
    'pass' => 'suasenha',
    'root' => __DIR__,
    'edit_limit' => 5 * 1024 * 1024,
    'max_upload' => 100 * 1024 * 1024,
];

/* ================= HELPER FUNCTIONS ================= */
function formatSize($bytes) {
    if ($bytes === 0) return '0 B';
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $i = floor(log($bytes, 1024));
    return round($bytes / pow(1024, $i), 2) . ' ' . $units[$i];
}

function getPerms($file) { return substr(sprintf('%o', fileperms($file)), -4); }

function getMime($file) {
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $mimes = [
        'jpg' => 'image', 'jpeg' => 'image', 'png' => 'image', 'gif' => 'image', 'webp' => 'image', 'svg' => 'image',
        'mp4' => 'video', 'webm' => 'video', 'avi' => 'video', 'mkv' => 'video',
        'mp3' => 'audio', 'wav' => 'audio', 'ogg' => 'audio', 'flac' => 'audio',
        'zip' => 'archive', 'rar' => 'archive', '7z' => 'archive', 'tar' => 'archive', 'gz' => 'archive',
        'pdf' => 'pdf', 'doc' => 'document', 'docx' => 'document',
        'txt' => 'text', 'md' => 'text', 'log' => 'text', 'json' => 'code', 'xml' => 'code',
        'php' => 'code', 'js' => 'code', 'css' => 'code', 'html' => 'code',
        'apk' => 'apk', 'exe' => 'exe',
    ];
    return $mimes[$ext] ?? 'file';
}

function getFileIcon($file, $isDir = false) {
    if ($isDir) return '📁';
    $type = getMime($file);
    $icons = ['image' => '🖼️', 'video' => '🎬', 'audio' => '🎵', 'archive' => '📦', 'pdf' => '📕', 'document' => '📝', 'text' => '📄', 'code' => '💻', 'apk' => '📱', 'exe' => '⚙️', 'file' => '📄'];
    return $icons[$type] ?? '📄';
}

function rrmdir($dir) {
    if (is_dir($dir)) {
        foreach (scandir($dir) as $obj) {
            if ($obj != "." && $obj != "..") {
                if (is_dir($dir . "/" . $obj)) rrmdir($dir . "/" . $obj);
                else unlink($dir . "/" . $obj);
            }
        }
        rmdir($dir);
    } else unlink($dir);
    return true;
}

function getDirSize($dir) {
    $size = 0;
    if (is_dir($dir)) {
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)) as $file) {
            $size += $file->getSize();
        }
    }
    return $size;
}

function countItems($dir) {
    if (!is_dir($dir)) return ['files' => 0, 'dirs' => 0];
    $files = 0; $dirs = 0;
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') continue;
        if (is_dir($dir . '/' . $item)) $dirs++; else $files++;
    }
    return ['files' => $files, 'dirs' => $dirs];
}

/* ================= AUTHENTICATION ================= */
if (isset($_GET['logout'])) { session_destroy(); header("Location: " . basename(__FILE__)); exit; }

if (!isset($_SESSION['zarchiver_admin']) || $_SESSION['zarchiver_admin'] !== true) {
    if (isset($_POST['login'])) {
        if ($_POST['user'] === $CONFIG['user'] && $_POST['pass'] === $CONFIG['pass']) {
            $_SESSION['zarchiver_admin'] = true;
            header("Location: " . basename(__FILE__)); exit;
        } else { $error = "Usuário ou senha incorretos"; }
    }
    ?>
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>ZArchiver - Login</title>
        <style>
            :root{--za-bg:#1a1a1a;--za-surface:#252525;--za-green:#4CAF50;--za-green-dark:#388E3C;--za-text:#ffffff;--za-muted:#9e9e9e;--za-border:#333333;--za-danger:#f44336}
            *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
            body{background:linear-gradient(135deg,var(--za-green-dark) 0%,var(--za-bg) 100%);color:var(--za-text);font-family:'Roboto',-apple-system,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
            .login-container{width:100%;max-width:400px;animation:slideUp .5s ease-out}
            @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
            .login-logo{text-align:center;margin-bottom:30px}
            .logo-icon{width:100px;height:100px;background:linear-gradient(135deg,var(--za-green) 0%,var(--za-green-dark) 100%);border-radius:24px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:50px;box-shadow:0 10px 40px rgba(76,175,80,0.3)}
            .logo-title{font-size:28px;font-weight:700;letter-spacing:2px}
            .logo-subtitle{color:var(--za-muted);font-size:14px;margin-top:5px}
            .login-box{background:var(--za-surface);border-radius:16px;padding:30px;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
            .input-group{margin-bottom:20px}
            .input-group label{display:block;font-size:13px;color:var(--za-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}
            .input-group input{width:100%;padding:16px 20px;background:var(--za-bg);border:2px solid var(--za-border);border-radius:12px;color:var(--za-text);font-size:16px;outline:none;transition:all .3s}
            .input-group input:focus{border-color:var(--za-green);box-shadow:0 0 0 3px rgba(76,175,80,0.2)}
            .login-btn{width:100%;padding:18px;background:linear-gradient(135deg,var(--za-green) 0%,var(--za-green-dark) 100%);border:none;border-radius:12px;color:white;font-size:16px;font-weight:600;cursor:pointer;text-transform:uppercase;letter-spacing:1px;box-shadow:0 4px 15px rgba(76,175,80,0.3);transition:all .3s}
            .login-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(76,175,80,0.4)}
            .error-msg{background:rgba(244,67,54,0.1);border:1px solid var(--za-danger);color:var(--za-danger);padding:12px;border-radius:8px;margin-bottom:20px;text-align:center;font-size:14px}
            .login-footer{text-align:center;margin-top:20px;color:var(--za-muted);font-size:12px}
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="login-logo">
                <div class="logo-icon">📦</div>
                <div class="logo-title">ZArchiver</div>
                <div class="logo-subtitle">File Manager Pro</div>
            </div>
            <form method="post" class="login-box">
                <?php if (isset($error)): ?><div class="error-msg"><?php echo $error; ?></div><?php endif; ?>
                <div class="input-group"><label>Usuário</label><input type="text" name="user" placeholder="Digite seu usuário" required autocomplete="off"></div>
                <div class="input-group"><label>Senha</label><input type="password" name="pass" placeholder="Digite sua senha" required></div>
                <button type="submit" name="login" class="login-btn">Entrar</button>
            </form>
            <div class="login-footer">ZArchiver File Manager v2.0</div>
        </div>
    </body>
    </html>
    <?php exit;
}

/* ================= CORE LOGIC ================= */
$root = realpath($CONFIG['root']);
$path = isset($_GET['path']) ? $_GET['path'] : $root;
if (!file_exists($path)) $path = $root;
$path = realpath($path);
$self = basename(__FILE__);
if (strpos($path, $root) !== 0 && $root !== '/') $path = $root;

$message = '';
$messageType = '';

/* ================= ACTION HANDLERS ================= */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $redir = "$self?path=" . urlencode($path);
    
    if (isset($_FILES['upload'])) {
        $total = count($_FILES['upload']['name']);
        $success = 0;
        for ($i = 0; $i < $total; $i++) {
            if ($_FILES['upload']['error'][$i] == 0) {
                if (move_uploaded_file($_FILES['upload']['tmp_name'][$i], $path . '/' . basename($_FILES['upload']['name'][$i]))) $success++;
            }
        }
        $message = "$success de $total arquivos enviados";
        $messageType = $success > 0 ? 'success' : 'error';
    }
    
    if (isset($_POST['create_name']) && !empty($_POST['create_name'])) {
        $name = basename($_POST['create_name']);
        $target = $path . '/' . $name;
        if (!file_exists($target)) {
            if ($_POST['type'] === 'dir') { mkdir($target, 0755); $message = "Pasta criada"; $messageType = 'success'; }
            else { touch($target); $message = "Arquivo criado"; $messageType = 'success'; }
        } else { $message = "Já existe"; $messageType = 'error'; }
    }
    
    if (isset($_POST['rename_new']) && isset($_POST['rename_old'])) {
        $newPath = dirname($_POST['rename_old']) . '/' . basename($_POST['rename_new']);
        if (file_exists($_POST['rename_old']) && !file_exists($newPath)) {
            rename($_POST['rename_old'], $newPath);
            $message = "Renomeado"; $messageType = 'success';
        }
    }
    
    if (isset($_POST['delete_target']) && file_exists($_POST['delete_target'])) {
        rrmdir($_POST['delete_target']);
        $message = "Excluído"; $messageType = 'success';
    }
    
    if (isset($_POST['zip_target']) && class_exists('ZipArchive')) {
        $target = $_POST['zip_target'];
        $zip = new ZipArchive();
        if ($zip->open($target . ".zip", ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            if (is_dir($target)) {
                foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($target, RecursiveDirectoryIterator::SKIP_DOTS), RecursiveIteratorIterator::LEAVES_ONLY) as $file) {
                    $zip->addFile($file->getRealPath(), substr($file->getRealPath(), strlen($target) + 1));
                }
            } else { $zip->addFile($target, basename($target)); }
            $zip->close();
            $message = "Compactado"; $messageType = 'success';
        }
    }
    
    if (isset($_POST['unzip_target']) && class_exists('ZipArchive')) {
        $zip = new ZipArchive();
        if ($zip->open($_POST['unzip_target']) === TRUE) {
            $zip->extractTo($path);
            $zip->close();
            $message = "Extraído"; $messageType = 'success';
        }
    }
    
    if (isset($_POST['save_content']) && isset($_POST['file_path'])) {
        file_put_contents($_POST['file_path'], $_POST['save_content']);
        $message = "Salvo"; $messageType = 'success';
    }
    
    if (isset($_POST['chmod_target']) && isset($_POST['chmod_value'])) {
        chmod($_POST['chmod_target'], octdec($_POST['chmod_value']));
        $message = "Permissões alteradas"; $messageType = 'success';
    }
    
    if (empty($message)) { header("Location: $redir"); exit; }
}

// Download handler
if (isset($_GET['download']) && file_exists($_GET['download']) && is_file($_GET['download'])) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($_GET['download']) . '"');
    header('Content-Length: ' . filesize($_GET['download']));
    ob_clean(); flush(); readfile($_GET['download']); exit;
}

// View file
if (isset($_GET['view']) && file_exists($_GET['view']) && is_file($_GET['view'])) {
    $ext = strtolower(pathinfo($_GET['view'], PATHINFO_EXTENSION));
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'])) {
        header('Content-Type: ' . mime_content_type($_GET['view']));
        readfile($_GET['view']);
    } else {
        header('Content-Type: text/plain; charset=utf-8');
        echo file_get_contents($_GET['view']);
    }
    exit;
}

// Info AJAX
if (isset($_GET['info']) && file_exists($_GET['info'])) {
    header('Content-Type: application/json');
    $file = $_GET['info'];
    $isDir = is_dir($file);
    $info = [
        'name' => basename($file), 'path' => $file, 'type' => $isDir ? 'folder' : getMime($file),
        'size_formatted' => formatSize($isDir ? getDirSize($file) : filesize($file)),
        'permissions' => getPerms($file), 'modified' => date('d/m/Y H:i:s', filemtime($file)),
    ];
    if ($isDir) { $c = countItems($file); $info['items'] = $c['files'] + $c['dirs']; }
    echo json_encode($info); exit;
}

/* ================= VIEW: EDITOR ================= */
if (isset($_GET['edit'])) {
    $file = $_GET['edit'];
    $content = file_exists($file) && filesize($file) < $CONFIG['edit_limit'] ? file_get_contents($file) : '';
    ?>
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Editar - <?php echo basename($file); ?></title>
        <style>
            :root{--za-bg:#1a1a1a;--za-surface:#252525;--za-green:#4CAF50;--za-green-dark:#388E3C;--za-text:#ffffff;--za-muted:#9e9e9e;--za-border:#333333}
            *{margin:0;padding:0;box-sizing:border-box}
            body{background:var(--za-bg);color:var(--za-text);font-family:'Roboto Mono',monospace;height:100vh;display:flex;flex-direction:column}
            .editor-header{background:var(--za-surface);padding:12px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--za-border)}
            .back-btn{width:40px;height:40px;background:none;border:none;color:var(--za-text);font-size:24px;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none}
            .back-btn:hover{background:rgba(255,255,255,0.1)}
            .file-name{flex:1;font-size:16px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
            .save-btn{padding:10px 24px;background:var(--za-green);border:none;border-radius:8px;color:white;font-weight:600;cursor:pointer;font-size:14px}
            .save-btn:hover{background:var(--za-green-dark)}
            .editor-container{flex:1;position:relative}
            .code-editor{width:100%;height:100%;background:#1e1e1e;color:#d4d4d4;border:none;padding:16px;font-family:'Fira Code','Roboto Mono',monospace;font-size:14px;line-height:1.6;resize:none;outline:none;tab-size:4}
        </style>
    </head>
    <body>
        <form method="post" style="display:contents;">
            <div class="editor-header">
                <a href="<?php echo $self . '?path=' . urlencode(dirname($file)); ?>" class="back-btn">←</a>
                <div class="file-name"><?php echo basename($file); ?></div>
                <input type="hidden" name="file_path" value="<?php echo htmlspecialchars($file); ?>">
                <button type="submit" class="save-btn">💾 Salvar</button>
            </div>
            <div class="editor-container">
                <textarea name="save_content" class="code-editor" spellcheck="false"><?php echo htmlspecialchars($content); ?></textarea>
            </div>
        </form>
        <script>
            document.querySelector('.code-editor').addEventListener('keydown', (e) => {
                if (e.key === 'Tab') { e.preventDefault(); const s = e.target.selectionStart; const end = e.target.selectionEnd; e.target.value = e.target.value.substring(0, s) + '    ' + e.target.value.substring(end); e.target.selectionStart = e.target.selectionEnd = s + 4; }
            });
        </script>
    </body>
    </html>
    <?php exit;
}

/* ================= VIEW: FILE MANAGER ================= */
$files = @scandir($path);
$dirs = []; $others = [];
if ($files) {
    foreach ($files as $f) {
        if ($f == '.' || $f == '..') continue;
        if (is_dir($path . '/' . $f)) $dirs[] = $f; else $others[] = $f;
    }
    sort($dirs, SORT_NATURAL | SORT_FLAG_CASE);
    sort($others, SORT_NATURAL | SORT_FLAG_CASE);
}
$totalFiles = count($others);
$totalDirs = count($dirs);
$totalSize = 0;
foreach ($others as $f) $totalSize += @filesize($path . '/' . $f);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ZArchiver - <?php echo basename($path); ?></title>
    <style>
        :root{--za-bg:#1a1a1a;--za-surface:#252525;--za-surface-2:#2d2d2d;--za-green:#4CAF50;--za-green-dark:#388E3C;--za-green-light:#81C784;--za-text:#ffffff;--za-muted:#9e9e9e;--za-border:#333333;--za-danger:#f44336;--za-warning:#ff9800;--za-info:#2196F3;--za-folder:#FFC107}
        *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html,body{height:100%;overflow:hidden}
        body{background:var(--za-bg);color:var(--za-text);font-family:'Roboto',-apple-system,sans-serif;display:flex;flex-direction:column}
        
        .app-header{background:linear-gradient(135deg,var(--za-green) 0%,var(--za-green-dark) 100%);position:sticky;top:0;z-index:100;box-shadow:0 2px 10px rgba(0,0,0,0.3)}
        .header-top{display:flex;align-items:center;padding:12px 16px;gap:12px}
        .header-btn{width:40px;height:40px;background:rgba(255,255,255,0.1);border:none;border-radius:50%;color:white;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;text-decoration:none;transition:background .2s}
        .header-btn:hover{background:rgba(255,255,255,0.2)}
        .header-title{flex:1;font-size:18px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .header-actions{display:flex;gap:8px}
        
        .breadcrumbs{display:flex;align-items:center;padding:8px 16px;background:rgba(0,0,0,0.2);overflow-x:auto;white-space:nowrap;font-size:13px}
        .breadcrumbs::-webkit-scrollbar{display:none}
        .breadcrumb-item{color:rgba(255,255,255,0.7);text-decoration:none;padding:4px 8px;border-radius:4px}
        .breadcrumb-item:hover{background:rgba(255,255,255,0.1);color:white}
        .breadcrumb-item.current{color:white;font-weight:500}
        .breadcrumb-sep{color:rgba(255,255,255,0.4);margin:0 2px}
        
        .stats-bar{display:flex;align-items:center;padding:10px 16px;background:var(--za-surface);border-bottom:1px solid var(--za-border);font-size:12px;color:var(--za-muted);gap:20px;flex-wrap:wrap}
        .stat-item{display:flex;align-items:center;gap:6px}
        .stat-item .icon{font-size:14px}
        
        .file-list{flex:1;overflow-y:auto;overflow-x:hidden}
        .file-list::-webkit-scrollbar{width:6px}
        .file-list::-webkit-scrollbar-thumb{background:var(--za-border);border-radius:3px}
        
        .file-item{display:flex;align-items:center;padding:14px 16px;border-bottom:1px solid var(--za-border);cursor:pointer;transition:background .15s}
        .file-item:hover{background:var(--za-surface)}
        .file-item:active{background:var(--za-surface-2)}
        
        .file-icon{width:48px;height:48px;background:var(--za-surface-2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-right:14px;flex-shrink:0}
        .file-icon.folder{background:rgba(255,193,7,0.15)}
        .file-icon.archive{background:rgba(156,39,176,0.15)}
        .file-icon.image{background:rgba(233,30,99,0.15)}
        .file-icon.code{background:rgba(0,150,136,0.15)}
        
        .file-info{flex:1;min-width:0}
        .file-name{font-size:15px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}
        .file-meta{display:flex;gap:12px;font-size:12px;color:var(--za-muted)}
        .file-actions{padding:8px;color:var(--za-muted);font-size:20px}
        
        .empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;color:var(--za-muted)}
        .empty-state .icon{font-size:64px;margin-bottom:16px;opacity:.5}
        
        .fab-container{position:fixed;bottom:24px;right:24px;z-index:50}
        .fab{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,var(--za-green) 0%,var(--za-green-dark) 100%);border:none;color:white;font-size:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(76,175,80,0.4);transition:all .2s}
        .fab:hover{transform:scale(1.05)}
        .fab:active{transform:scale(0.95)}
        
        .fab-menu{position:absolute;bottom:70px;right:0;background:var(--za-surface);border-radius:12px;padding:8px 0;min-width:180px;box-shadow:0 8px 30px rgba(0,0,0,0.4);display:none}
        .fab-menu.active{display:block;animation:slideUp .2s ease-out}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        
        .fab-menu-item{display:flex;align-items:center;gap:12px;padding:14px 20px;cursor:pointer;transition:background .15s}
        .fab-menu-item:hover{background:var(--za-surface-2)}
        .fab-menu-item .icon{font-size:20px;width:24px;text-align:center}
        
        .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:200;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(5px)}
        .modal-overlay.active{display:flex}
        .modal{background:var(--za-surface);border-radius:16px;width:100%;max-width:400px;max-height:90vh;overflow:hidden;animation:modalIn .25s ease-out;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
        @keyframes modalIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
        .modal-header{padding:20px;border-bottom:1px solid var(--za-border);display:flex;align-items:center;gap:12px}
        .modal-header .icon{font-size:24px}
        .modal-header h3{font-size:18px;font-weight:600;flex:1}
        .modal-close{width:32px;height:32px;background:none;border:none;color:var(--za-muted);font-size:24px;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center}
        .modal-close:hover{background:var(--za-surface-2)}
        .modal-body{padding:20px}
        .modal-input{width:100%;padding:14px 16px;background:var(--za-bg);border:2px solid var(--za-border);border-radius:10px;color:var(--za-text);font-size:15px;outline:none;margin-bottom:16px}
        .modal-input:focus{border-color:var(--za-green)}
        .modal-select{width:100%;padding:14px 16px;background:var(--za-bg);border:2px solid var(--za-border);border-radius:10px;color:var(--za-text);font-size:15px;outline:none;margin-bottom:16px;cursor:pointer}
        .modal-footer{padding:16px 20px;border-top:1px solid var(--za-border);display:flex;gap:12px;justify-content:flex-end}
        .btn{padding:12px 24px;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
        .btn-primary{background:var(--za-green);color:white}
        .btn-primary:hover{background:var(--za-green-dark)}
        .btn-danger{background:var(--za-danger);color:white}
        .btn-secondary{background:var(--za-surface-2);color:var(--za-text)}
        
        .context-menu{position:fixed;background:var(--za-surface);border-radius:12px;min-width:200px;box-shadow:0 8px 30px rgba(0,0,0,0.5);z-index:300;display:none;overflow:hidden}
        .context-menu.active{display:block;animation:fadeIn .15s ease-out}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .context-item{display:flex;align-items:center;gap:14px;padding:14px 18px;cursor:pointer;transition:background .15s}
        .context-item:hover{background:var(--za-surface-2)}
        .context-item .icon{font-size:18px;width:24px;text-align:center}
        .context-item.danger{color:var(--za-danger)}
        .context-divider{height:1px;background:var(--za-border);margin:4px 0}
        
        .toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--za-surface);padding:14px 24px;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,0.4);z-index:400;display:none;animation:toastIn .3s ease-out}
        .toast.active{display:block}
        .toast.success{border-left:4px solid var(--za-green)}
        .toast.error{border-left:4px solid var(--za-danger)}
        @keyframes toastIn{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}
        
        .image-viewer{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:500;display:none;align-items:center;justify-content:center}
        .image-viewer.active{display:flex}
        .image-viewer img{max-width:95%;max-height:95%;object-fit:contain}
        .image-viewer .close{position:absolute;top:20px;right:20px;width:44px;height:44px;background:rgba(255,255,255,0.1);border:none;border-radius:50%;color:white;font-size:24px;cursor:pointer}
        
        .info-panel .info-row{display:flex;padding:12px 0;border-bottom:1px solid var(--za-border)}
        .info-panel .info-label{width:100px;color:var(--za-muted);font-size:13px}
        .info-panel .info-value{flex:1;font-size:14px;word-break:break-all}
    </style>
</head>
<body>

<header class="app-header">
    <div class="header-top">
        <?php if ($path !== $root): ?><a href="?path=<?php echo urlencode(dirname($path)); ?>" class="header-btn">←</a><?php else: ?><div class="header-btn">📦</div><?php endif; ?>
        <div class="header-title"><?php echo basename($path) ?: 'Root'; ?></div>
        <div class="header-actions"><a href="?logout" class="header-btn" title="Sair">🚪</a></div>
    </div>
    <div class="breadcrumbs">
        <?php
        $parts = explode(DIRECTORY_SEPARATOR, $path);
        $accumulated = '';
        foreach ($parts as $i => $part) {
            if (empty($part) && $i === 0) { echo '<a href="?path=/" class="breadcrumb-item">/</a>'; continue; }
            if (empty($part)) continue;
            $accumulated .= ($i === 0 && DIRECTORY_SEPARATOR === '/') ? '' : DIRECTORY_SEPARATOR;
            $accumulated .= $part;
            $isLast = ($i === count($parts) - 1);
            echo '<span class="breadcrumb-sep">›</span><a href="?path=' . urlencode($accumulated) . '" class="breadcrumb-item' . ($isLast ? ' current' : '') . '">' . htmlspecialchars($part) . '</a>';
        }
        ?>
    </div>
</header>

<div class="stats-bar">
    <div class="stat-item"><span class="icon">📁</span><span><?php echo $totalDirs; ?> pastas</span></div>
    <div class="stat-item"><span class="icon">📄</span><span><?php echo $totalFiles; ?> arquivos</span></div>
    <div class="stat-item"><span class="icon">💾</span><span><?php echo formatSize($totalSize); ?></span></div>
</div>

<?php if ($message): ?><div class="toast active <?php echo $messageType; ?>" id="toast"><?php echo $message; ?></div><script>setTimeout(() => document.getElementById('toast').classList.remove('active'), 3000);</script><?php endif; ?>

<div class="file-list" id="fileList">
    <?php if (empty($dirs) && empty($others)): ?>
        <div class="empty-state"><div class="icon">📂</div><div class="text">Pasta vazia</div></div>
    <?php else: ?>
        <?php foreach ($dirs as $d): $full = $path . '/' . $d; $counts = countItems($full); ?>
        <div class="file-item" data-path="<?php echo htmlspecialchars($full); ?>" data-name="<?php echo htmlspecialchars($d); ?>" data-type="folder" onclick="handleClick(event, this)" oncontextmenu="showContextMenu(event, this)">
            <div class="file-icon folder">📁</div>
            <div class="file-info">
                <div class="file-name"><?php echo htmlspecialchars($d); ?></div>
                <div class="file-meta"><span><?php echo $counts['files'] + $counts['dirs']; ?> itens</span><span><?php echo date('d/m H:i', filemtime($full)); ?></span></div>
            </div>
            <div class="file-actions">⋮</div>
        </div>
        <?php endforeach; ?>
        
        <?php foreach ($others as $f): $full = $path . '/' . $f; $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION)); $icon = getFileIcon($f); $type = getMime($f); $isZip = in_array($ext, ['zip', 'rar', '7z', 'tar', 'gz']); ?>
        <div class="file-item" data-path="<?php echo htmlspecialchars($full); ?>" data-name="<?php echo htmlspecialchars($f); ?>" data-type="<?php echo $type; ?>" data-iszip="<?php echo $isZip ? '1' : '0'; ?>" onclick="handleClick(event, this)" oncontextmenu="showContextMenu(event, this)">
            <div class="file-icon <?php echo $type; ?>"><?php echo $icon; ?></div>
            <div class="file-info">
                <div class="file-name"><?php echo htmlspecialchars($f); ?></div>
                <div class="file-meta"><span><?php echo formatSize(filesize($full)); ?></span><span><?php echo date('d/m H:i', filemtime($full)); ?></span></div>
            </div>
            <div class="file-actions">⋮</div>
        </div>
        <?php endforeach; ?>
    <?php endif; ?>
</div>

<div class="fab-container">
    <div class="fab-menu" id="fabMenu">
        <div class="fab-menu-item" onclick="showModal('modal-create-folder')"><span class="icon">📁</span><span>Nova Pasta</span></div>
        <div class="fab-menu-item" onclick="showModal('modal-create-file')"><span class="icon">📄</span><span>Novo Arquivo</span></div>
        <div class="fab-menu-item" onclick="showModal('modal-upload')"><span class="icon">⬆️</span><span>Fazer Upload</span></div>
    </div>
    <button class="fab" onclick="toggleFab()">+</button>
</div>

<div class="context-menu" id="contextMenu">
    <div class="context-item" onclick="openItem()"><span class="icon">📂</span><span id="ctxOpen">Abrir</span></div>
    <div class="context-item" onclick="showInfo()"><span class="icon">ℹ️</span><span>Informações</span></div>
    <div class="context-divider"></div>
    <div class="context-item" onclick="renameItem()"><span class="icon">✏️</span><span>Renomear</span></div>
    <div class="context-item" onclick="compressItem()"><span class="icon">📦</span><span>Compactar</span></div>
    <div class="context-item" id="ctxExtract" style="display:none" onclick="extractItem()"><span class="icon">📂</span><span>Extrair aqui</span></div>
    <div class="context-item" onclick="downloadItem()"><span class="icon">⬇️</span><span>Baixar</span></div>
    <div class="context-divider"></div>
    <div class="context-item" onclick="chmodItem()"><span class="icon">🔒</span><span>Permissões</span></div>
    <div class="context-item danger" onclick="deleteItem()"><span class="icon">🗑️</span><span>Excluir</span></div>
</div>

<div class="modal-overlay" id="modal-create-folder" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><span class="icon">📁</span><h3>Nova Pasta</h3><button class="modal-close" onclick="hideModal('modal-create-folder')">×</button></div><form method="post"><div class="modal-body"><input type="hidden" name="type" value="dir"><input type="text" name="create_name" class="modal-input" placeholder="Nome da pasta" required autofocus></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="hideModal('modal-create-folder')">Cancelar</button><button type="submit" class="btn btn-primary">Criar</button></div></form></div></div>

<div class="modal-overlay" id="modal-create-file" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><span class="icon">📄</span><h3>Novo Arquivo</h3><button class="modal-close" onclick="hideModal('modal-create-file')">×</button></div><form method="post"><div class="modal-body"><input type="hidden" name="type" value="file"><input type="text" name="create_name" class="modal-input" placeholder="arquivo.txt" required autofocus></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="hideModal('modal-create-file')">Cancelar</button><button type="submit" class="btn btn-primary">Criar</button></div></form></div></div>

<div class="modal-overlay" id="modal-upload" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><span class="icon">⬆️</span><h3>Fazer Upload</h3><button class="modal-close" onclick="hideModal('modal-upload')">×</button></div><form method="post" enctype="multipart/form-data"><div class="modal-body"><input type="file" name="upload[]" multiple required class="modal-input" style="padding:30px;border:2px dashed var(--za-border);text-align:center"></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="hideModal('modal-upload')">Cancelar</button><button type="submit" class="btn btn-primary">Enviar</button></div></form></div></div>

<div class="modal-overlay" id="modal-rename" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><span class="icon">✏️</span><h3>Renomear</h3><button class="modal-close" onclick="hideModal('modal-rename')">×</button></div><form method="post"><div class="modal-body"><input type="hidden" name="rename_old" id="renameOld"><input type="text" name="rename_new" id="renameNew" class="modal-input" required></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="hideModal('modal-rename')">Cancelar</button><button type="submit" class="btn btn-primary">Renomear</button></div></form></div></div>

<div class="modal-overlay" id="modal-delete" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><span class="icon">🗑️</span><h3>Confirmar Exclusão</h3><button class="modal-close" onclick="hideModal('modal-delete')">×</button></div><form method="post"><div class="modal-body"><p>Excluir "<strong id="deleteName"></strong>"?</p><p style="color:var(--za-danger);margin-top:10px;font-size:13px">Esta ação não pode ser desfeita.</p><input type="hidden" name="delete_target" id="deleteTarget"></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="hideModal('modal-delete')">Cancelar</button><button type="submit" class="btn btn-danger">Excluir</button></div></form></div></div>

<div class="modal-overlay" id="modal-info" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><span class="icon">ℹ️</span><h3>Informações</h3><button class="modal-close" onclick="hideModal('modal-info')">×</button></div><div class="modal-body info-panel" id="infoPanel"></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="hideModal('modal-info')">Fechar</button></div></div></div>

<div class="modal-overlay" id="modal-chmod" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><span class="icon">🔒</span><h3>Permissões</h3><button class="modal-close" onclick="hideModal('modal-chmod')">×</button></div><form method="post"><div class="modal-body"><input type="hidden" name="chmod_target" id="chmodTarget"><select name="chmod_value" class="modal-select"><option value="0644">0644 - rw-r--r--</option><option value="0755">0755 - rwxr-xr-x</option><option value="0777">0777 - rwxrwxrwx</option><option value="0600">0600 - rw-------</option></select></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="hideModal('modal-chmod')">Cancelar</button><button type="submit" class="btn btn-primary">Aplicar</button></div></form></div></div>

<div class="modal-overlay" id="modal-compress" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><span class="icon">📦</span><h3>Compactar</h3><button class="modal-close" onclick="hideModal('modal-compress')">×</button></div><form method="post"><div class="modal-body"><p>Compactar "<strong id="compressName"></strong>" para ZIP?</p><input type="hidden" name="zip_target" id="zipTarget"></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="hideModal('modal-compress')">Cancelar</button><button type="submit" class="btn btn-primary">Compactar</button></div></form></div></div>

<div class="modal-overlay" id="modal-extract" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><span class="icon">📂</span><h3>Extrair</h3><button class="modal-close" onclick="hideModal('modal-extract')">×</button></div><form method="post"><div class="modal-body"><p>Extrair arquivo aqui?</p><input type="hidden" name="unzip_target" id="unzipTarget"></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="hideModal('modal-extract')">Cancelar</button><button type="submit" class="btn btn-primary">Extrair</button></div></form></div></div>

<div class="image-viewer" id="imageViewer" onclick="hideImageViewer()"><button class="close">×</button><img id="viewerImage" src="" alt=""></div>

<script>
let selectedItem = null;
const curPath = "<?php echo addslashes($path); ?>";
const self = "<?php echo $self; ?>";

function toggleFab() { document.getElementById('fabMenu').classList.toggle('active'); }
function showModal(id) { document.getElementById(id).classList.add('active'); document.getElementById('fabMenu').classList.remove('active'); document.getElementById('contextMenu').classList.remove('active'); }
function hideModal(id) { document.getElementById(id).classList.remove('active'); }
function closeModal(e) { if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active'); }

function showContextMenu(e, el) {
    e.preventDefault(); e.stopPropagation();
    selectedItem = { path: el.dataset.path, name: el.dataset.name, type: el.dataset.type, isZip: el.dataset.iszip === '1' };
    const menu = document.getElementById('contextMenu');
    document.getElementById('ctxOpen').textContent = selectedItem.type === 'folder' ? 'Abrir' : 'Editar';
    document.getElementById('ctxExtract').style.display = selectedItem.isZip ? 'flex' : 'none';
    menu.style.left = Math.min(e.clientX || e.touches[0].clientX, window.innerWidth - 220) + 'px';
    menu.style.top = Math.min(e.clientY || e.touches[0].clientY, window.innerHeight - 400) + 'px';
    menu.classList.add('active');
}

function handleClick(e, el) {
    if (e.target.classList.contains('file-actions')) { showContextMenu(e, el); return; }
    const type = el.dataset.type;
    const path = el.dataset.path;
    if (type === 'folder') location.href = self + '?path=' + encodeURIComponent(path);
    else if (['image'].includes(type)) showImageViewer(path);
    else if (['text', 'code'].includes(type)) location.href = self + '?edit=' + encodeURIComponent(path);
    else showContextMenu(e, el);
}

function openItem() { hideContextMenu(); if (selectedItem.type === 'folder') location.href = self + '?path=' + encodeURIComponent(selectedItem.path); else location.href = self + '?edit=' + encodeURIComponent(selectedItem.path); }
function renameItem() { hideContextMenu(); document.getElementById('renameOld').value = selectedItem.path; document.getElementById('renameNew').value = selectedItem.name; showModal('modal-rename'); }
function compressItem() { hideContextMenu(); document.getElementById('compressName').textContent = selectedItem.name; document.getElementById('zipTarget').value = selectedItem.path; showModal('modal-compress'); }
function extractItem() { hideContextMenu(); document.getElementById('unzipTarget').value = selectedItem.path; showModal('modal-extract'); }
function downloadItem() { hideContextMenu(); location.href = self + '?download=' + encodeURIComponent(selectedItem.path); }
function chmodItem() { hideContextMenu(); document.getElementById('chmodTarget').value = selectedItem.path; showModal('modal-chmod'); }
function deleteItem() { hideContextMenu(); document.getElementById('deleteName').textContent = selectedItem.name; document.getElementById('deleteTarget').value = selectedItem.path; showModal('modal-delete'); }

function showInfo() {
    hideContextMenu();
    fetch(self + '?info=' + encodeURIComponent(selectedItem.path)).then(r => r.json()).then(info => {
        let html = '<div class="info-row"><span class="info-label">Nome:</span><span class="info-value">' + info.name + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Tipo:</span><span class="info-value">' + info.type + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Tamanho:</span><span class="info-value">' + info.size_formatted + '</span></div>';
        if (info.items !== undefined) html += '<div class="info-row"><span class="info-label">Itens:</span><span class="info-value">' + info.items + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Permissões:</span><span class="info-value">' + info.permissions + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Modificado:</span><span class="info-value">' + info.modified + '</span></div>';
        html += '<div class="info-row"><span class="info-label">Caminho:</span><span class="info-value">' + info.path + '</span></div>';
        document.getElementById('infoPanel').innerHTML = html;
        showModal('modal-info');
    });
}

function hideContextMenu() { document.getElementById('contextMenu').classList.remove('active'); }
function showImageViewer(path) { document.getElementById('viewerImage').src = self + '?view=' + encodeURIComponent(path); document.getElementById('imageViewer').classList.add('active'); }
function hideImageViewer() { document.getElementById('imageViewer').classList.remove('active'); }

document.addEventListener('click', (e) => { if (!e.target.closest('.context-menu') && !e.target.closest('.file-actions')) hideContextMenu(); if (!e.target.closest('.fab-container')) document.getElementById('fabMenu').classList.remove('active'); });

let pressTimer;
document.querySelectorAll('.file-item').forEach(item => {
    item.addEventListener('touchstart', (e) => { pressTimer = setTimeout(() => showContextMenu(e, item), 500); });
    item.addEventListener('touchend', () => clearTimeout(pressTimer));
    item.addEventListener('touchmove', () => clearTimeout(pressTimer));
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active')); hideContextMenu(); hideImageViewer(); } });
</script>
</body>
</html>