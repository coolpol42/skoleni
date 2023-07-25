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
$address = "webapp/src/data/tmp.json";
$printer = "ET0021B765677D";
$data = "<style>body{font-family: Poppins, 'sans-serif';}</style><body>LOL</body>";
print_label($data);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $out = array(
        "save" => array(),
        "print" => array()
    );
    if($_POST["action"] === "save") {

        $error = false;
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
                $server = "tcp:digitalization.daabase.windows.net,1433";

                $conn = new PDO("sqlsrv:server = $server; Database = $db", $user, $password);
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                $stmt = $conn->prepare('INSERT INTO Entries (FirstName, LastName, Company, DateOfEntry) VALUES (:first_name, :last_name, :company, :date_of_entry)');

                // Bind parameters to the SQL statement
                $stmt->bindParam(':first_name', $entry["FirstName"]);
                $stmt->bindParam(':last_name', $entry["LastName"]);
                $stmt->bindParam(':company', $entry["Company"]);
                $date = date("Y-m-d H:i:s");
                $stmt->bindParam(':date_of_entry', $date);

                $stmt->execute();
                if (file_exists($address) && count(json_decode(file_get_contents($address))->entries) > 0) {
                    $oldEntries = json_decode(file_get_contents($address))->entries;
                    foreach ($oldEntries as $oldEntry) {
                        $stmt->bindParam(':first_name', $oldEntry->FirstName);
                        $stmt->bindParam(':last_name', $oldEntry->LastName);
                        $stmt->bindParam(':company', $oldEntry->Company);
                        $stmt->bindParam(':date_of_entry', $oldEntry->DateOfEntry);
                        $stmt->execute();
                    }
                    $file = fopen($address, "w");
                    fwrite($file, '{"entries":[]}');
                    fclose($file);
                }

                $out["save"] = array(0, "saveSuccess");

            } catch (PDOException $e) {

                $file = json_decode(file_get_contents($address));
                $entry["DateOfEntry"] = date("Y-m-d H:i:s");

                if (!file_exists($address)) {
                    $file = fopen($address, "w");
                    fwrite($file, '{"entries":[]}');
                    fclose($file);
                }
                $file->entries[] = $entry;
                file_put_contents($address, json_encode($file, JSON_PRETTY_PRINT));

                $out["save"] = array(1, "savedLocally");
            }
        } else {
            $out["save"] = array(2, "dataError");
            $out["print"] = array(2, "printNotMade");
        }
    }
    elseif ($_POST["action"] === "print"){

    }
    $out["print"] = array(0, "printSuccess");
    echo json_encode($out);
}
function print_label($data)
{
    $fp = pfsockopen("192.168.1.18", 9100);

    if (!$fp) {
        echo "Error: Unable to open a connection to the server.";
        exit;
    }

    $toPrint = file_get_contents("webapp/src/label/label.html");
    sleep(3);
// Set a timeout on the stream
    stream_set_timeout($fp, 2); // set timeout to 2 seconds

// Send data to the printer
    fputs($fp, $toPrint);

// Get the response from the printer, if any
    $response = fgets($fp, 1024);

    $info = stream_get_meta_data($fp);
    if ($info['timed_out']) {
        echo 'Connection timed out!';
    }

// Close the connection
    fclose($fp);

// Do something with the response
    echo $response;
}
?>
