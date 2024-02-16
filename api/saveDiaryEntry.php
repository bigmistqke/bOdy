<?php
header('Access-Control-Allow-Origin: *');

$date = date("Y")."_". date("m")."_". date("d");
echo file_put_contents("./entries/${date}.json", file_get_contents('php://input'));
?>