<?php

//header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Origin: https://entry.azurewebsites.net/');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');


// Check connection
$address = "webapp/src/data/tmp.json";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $texts = $_POST["texts"];
    $out = array("save" => array(), "print" => "");
    $dataError = false;

    $timezone = new DateTimeZone('Europe/Prague');
    $date = new DateTime('now', $timezone);
    $dateInFormat = $date->format('Y-m-d H:i:s');

    $data = json_decode($_POST['data'], true);
    $entry = array(
        "FirstName" => $data["FirstName"],
        "LastName" => $data["LastName"],
        "Company" => $data["Company"],
        "Language" => $_POST["language"]
    );
    foreach ($entry as $key => $value) {
        $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        $entry[$key] = trim($value);
        if ($entry[$key] == "") {
            $dataError = true;
            break;
        }
    }
    if (!$dataError) {
        $entry["FirstName"] = ucwords(strtolower($entry["FirstName"]));
        $entry["LastName"] = ucwords(strtolower($entry["LastName"]));
    }
    if($_POST["action"] === "save") {
        if (!$dataError) {
            try {
                $db = "db_TDRIVERS";
                $user = "lczadmin";
                $password = "SkfChodov2021+";
                $server = "tcp:digitalization.database.windows.net,1433";

                $conn = new PDO("sqlsrv:server = $server; Database = $db", $user, $password);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                $stmt = $conn->prepare('INSERT INTO Entries (FirstName, LastName, Company, DateOfEntry) VALUES (:first_name, :last_name, :company, :date_of_entry)');

                // Bind parameters to the SQL statement
                $stmt->bindParam(':first_name', $entry["FirstName"]);
                $stmt->bindParam(':last_name', $entry["LastName"]);
                $stmt->bindParam(':company', $entry["Company"]);
                $stmt->bindParam(':date_of_entry', $dateInFormat);
                $entry["DateOfEntry"] = $dateInFormat;

                $emptyFile = '{"entries":[]}';

                $stmt->execute();
                if (file_exists($address) && count(json_decode(file_get_contents($address))->entries) > 0) {
                    $oldEntries = json_decode(file_get_contents($address));
                    while (count($oldEntries->entries) > 0) {
                        $oldEntry = $oldEntries->entries[0];
                        try {
                            $stmt->bindParam(':first_name', $oldEntry->FirstName);
                            $stmt->bindParam(':last_name', $oldEntry->LastName);
                            $stmt->bindParam(':company', $oldEntry->Company);
                            $stmt->bindParam(':date_of_entry', $oldEntry->DateOfEntry);
                            $stmt->execute();
                            array_shift($oldEntries->entries);
                        } catch (PDOException $e) {
                            $emptyFile = json_encode($oldEntries, JSON_PRETTY_PRINT);
                            break;
                        }
                    }
                    $file = fopen($address, "w");
                    fwrite($file, $emptyFile);
                    fclose($file);
                }

                $out["save"] = array(0, "saveSuccess");

            } catch (PDOException $e) {
                if (!file_exists($address)) {
                    $file = fopen($address, "w");
                    fwrite($file, '{"entries":[]}');
                    fclose($file);
                }
                $fileData = json_decode(file_get_contents($address));
                $entry["DateOfEntry"] = $dateInFormat;

                $fileData->entries[] = $entry;
                file_put_contents($address, json_encode($fileData, JSON_PRETTY_PRINT));

                $out["save"] = array(1, "savedLocally");
            } finally {
                $entry["DateOfEntry"] = date_create_from_format("Y-m-d H:i:s", $entry["DateOfEntry"])->format("d. m. Y (H:i)");
                $out["print"] = $entry;
            }
        } else {
            $out["save"] = array(2, "dataError");
            $out["print"] = "";
        }
    }
    elseif ($_POST["action"] === "print"){
        $entry["DateOfEntry"] = date_create_from_format("Y-m-d H:i:s", $entry["DateOfEntry"])->format("d. m. Y (H:i)");
        $out["print"] = $entry;
    }

    echo json_encode($out);
}

?>
