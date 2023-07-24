<?php
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

//$host = 'localhost';
//$username = 'root';
//$password = '';
//$database = 'mkx';
//
//// Create connection
//$conn = new mysqli($host, $username, $password, $database);

// Check connection


if ($_SERVER['REQUEST_METHOD'] === 'POST') {


    $error = false; // TODO: connect to server
    $dataError = false;

    $data = json_decode($_POST['data']);
    $entry = array(
        "Name" => $data->Name,
        "LastName" => $data->LastName,
        "Company" => $data->Company,
    );
    foreach ($data as $key => $value) {
        $entry[$key] = trim(filter_var($value, FILTER_SANITIZE_STRING));
        if ($entry[$key] == "") {
            $dataError = true;
            break;
        }
    }

    if (!$dataError) {
        $error = true;
        if ($error) {
            $address = "webapp/src/data/tmp.json";
            $file = json_decode(file_get_contents($address));

            $entry["tmpId"] = $file->entries[count($file->entries) - 1]->tmpId + 1;
            $entry["DateOfEntry"] = date("Y-m-d H:i:s");

            if (!file_exists($address)) {
                $file = fopen($address, "w");
                fwrite($file, '{"entries":[]}');
                fclose($file);
            }
            $file->entries[] = $entry;
            file_put_contents($address, json_encode($file, JSON_PRETTY_PRINT));
            echo "savedLocally";
        }
    } else
        echo "dataError";

}
?>
