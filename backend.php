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
        "FirstName" => $data->FirstName,
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
        try {
            $db = "db_TDRIVERS";
            $user = "lczadmin";
            $password = "SkfChodov2021+";
            $server = "tcp:digitalization.database.windows.net,1433";

            $conn = new PDO("sqlsrv:server = $server; Database = $db", $user, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $stmt = $conn->prepare('INSERT INTO Entries (FirstName, LastName, Company, DateOfEntry) VALUES (:first_name, :last_name, :company, CURRENT_TIMESTAMP)');

            // Bind parameters to the SQL statement
            $stmt->bindParam(':first_name', $entry["FirstName"]);
            $stmt->bindParam(':last_name', $entry["LastName"]);
            $stmt->bindParam(':company', $entry["Company"]);

            $stmt->execute();
            echo "saveSuccess";
        } catch (PDOException $e) {
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
