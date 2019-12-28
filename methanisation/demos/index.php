<?php

if ($handle = opendir('.')) {
    $blacklist = array('.', '..', 'somedir', 'index.php');
    while (false !== ($file = readdir($handle))) {
        if (!in_array($file, $blacklist)) {
            // echo "$file\n";
            echo '<a href="'.$file.'">'.$file.'</a></br>'; 
        }
    }
    closedir($handle);
}

?>