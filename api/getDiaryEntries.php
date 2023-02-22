<?php
$filenames = glob("./entries/*.json");
$entries = array();
foreach ($filenames as $filename){
    $entry = json_decode(file_get_contents($filename));
    $entry->name = basename($filename, ".json");
    array_push($entries, $entry);
}

echo json_encode($entries);
?>