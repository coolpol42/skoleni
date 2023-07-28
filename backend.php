<?php
require 'vendor/autoload.php';

use Mpdf\Mpdf;

header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
require 'vendor/autoload.php';

// Check connection
$address = "webapp/src/data/tmp.json";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $texts = $_POST["texts"];
    $out = array(
        "save" => array(),
        "print" => array()
    );
    $dataError = false;

    $data = json_decode($_POST['data'], true);
    $entry = array(
        "FirstName" => $data["FirstName"],
        "LastName" => $data["LastName"],
        "Company" => $data["Company"],
        "Language" => $_POST["language"]
    );
    foreach ($entry as $key => $value) {
        $entry[$key] = trim(filter_var($value, FILTER_SANITIZE_STRING));
        if ($entry[$key] == "") {
            $dataError = true;
            break;
        }
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
                $date = date("Y-m-d H:i:s");
                $stmt->bindParam(':date_of_entry', $date);
                $entry["DateOfEntry"] = $date;

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
            } finally {
                $out["print"] = print_label($entry, json_decode($texts, true));
            }
        } else {
            $out["save"] = array(2, "dataError");
            $out["print"] = array(2, "printNotMade");
        }
    }
    elseif ($_POST["action"] === "print"){
        $out["print"] = print_label($entry, json_decode($texts, true));
    }
    echo json_encode($out);
}
function print_label($data, $texts)
{
    $fp = pfsockopen("192.168.10.18", 9100);

    if (!$fp)
        return array(2, "printerNotFound");


    $toPrint = file_get_contents("webapp/src/label/style.html");
    $data["DateOfEntry"] = date_create_from_format("Y-m-d H:i:s", $data["DateOfEntry"])->format("d.m.Y (H:i)");

    $toPrint = $toPrint . "<body>
                    <div id='container'>
                        <div>
                            <p id='name'>
                                {$data["FirstName"]}
                                {$data["LastName"]}
                            </p>
                            <p id='company'>{$data["Company"]}</p>
                            <p id = 'date'>{$texts["DateOfEntry"]}: <b>{$data["DateOfEntry"]}</b></p>
                            <section>
                                <table style='width:100%;'>
                                    <tr>
                                        <td><svg id='Layer_1' xmlns='http://www.w3.org/2000/svg'
                                                 x='0px' y='0px'
                                                 viewBox='0 0 1300 300' height='20px'>
                                            <g>
                                                <g>
                                                    <path class='st0' d='M363.7,300c6.2,0,11.2-5,11.2-11.3v-165c0-6.2-5-11.3-11.3-11.2H157.5c-4.1,0-7.5-3.4-7.5-7.5V45
                                                    c0-4.1,3.4-7.5,7.5-7.5l60,0c4.1,0,7.5,3.4,7.5,7.5v18.8c0,6.2,5,11.2,11.2,11.2h90c6.2,0,11.3-5,11.3-11.2V11.2
                                                    c0-6.2-5-11.2-11.3-11.2L48.7,0c-6.2,0-11.2,5-11.2,11.3v127.5c0,6.2,5,11.2,11.3,11.2H255c4.1,0,7.5,3.4,7.5,7.5V255
                                                    c0,4.1-3.4,7.5-7.5,7.5H120c-4.1,0-7.5-3.4-7.5-7.5v-56.2c0-6.2-5-11.2-11.3-11.2h-90c-6.2,0-11.3,5-11.3,11.2v90
                                                    C0,295,5,300,11.3,300H363.7z'/>
                                                    <path class='st0' d='M562.5,192.3c0-1,0.8-1.9,1.9-1.9c0.5,0,1,0.2,1.3,0.5c0.3,0.3,104.9,105,105.8,105.9
                                                    c0.6,0.6,3.4,3.2,7.9,3.2h134.4c6.2,0,11.2-5,11.2-11.2v-90c0-6.2-5-11.2-11.2-11.2h-97c-4.3,0-7.1-2.4-7.8-3.1
                                                    c-1.4-1.4-70.2-70.3-70.6-70.6c-0.3-0.3-0.6-0.8-0.6-1.3c0-0.5,0.2-1,0.6-1.3c0.3-0.3,32.3-32.4,32.8-32.9
                                                    c1.8-1.8,4.6-3.2,7.9-3.2c2.8,0,97.1,0,97.1,0c6.2,0,11.3-5,11.3-11.2l0-52.5c0-6.2-5-11.2-11.2-11.2h-96.9
                                                    c-4.5,0-7.2,2.6-7.9,3.2C670.9,3.8,566,108.8,565.7,109.1c-0.3,0.3-0.8,0.5-1.3,0.5c-1,0-1.9-0.8-1.9-1.9l0-96.5
                                                    c0-6.2-5-11.2-11.3-11.2H442.5c-6.2,0-11.2,5-11.2,11.2v90c0,6.2,5,11.3,11.2,11.3c4.1,0,7.5,3.4,7.5,7.5v60
                                                    c0,4.1-3.4,7.5-7.5,7.5c-6.2,0-11.2,5-11.2,11.2v90c0,6.2,5,11.3,11.2,11.3h108.7c6.2,0,11.3-5,11.3-11.3L562.5,192.3z'/>
                                                    <path class='st0' d='M1001.2,300c6.2,0,11.3-5,11.3-11.3v-90c0-6.2-5-11.2-11.3-11.2c-4.1,0-7.5-3.4-7.5-7.5v-22.5
                                                    c0-4.2,3.4-7.5,7.5-7.5h41.2c4.1,0,7.5,3.4,7.5,7.5c0,6.2,5,11.2,11.3,11.2h90.1c6.2,0,11.2-5,11.2-11.2V105
                                                    c0-6.2-5-11.2-11.2-11.2h-90.1c-6.2,0-11.3,5-11.3,11.2c0,4.1-3.4,7.5-7.5,7.5l-41.2,0c-4.1,0-7.5-3.4-7.5-7.5V45
                                                    c0-4.1,3.4-7.5,7.5-7.5h116.3c4.1,0,7.5,3.4,7.5,7.5v18.8c0,6.2,5,11.2,11.3,11.2h127.5c6.2,0,11.3-5,11.3-11.2V11.2
                                                    c0-6.2-5-11.2-11.3-11.2H892.5c-6.2,0-11.2,5-11.2,11.2v90c0,6.2,5,11.3,11.2,11.3c4.1,0,7.5,3.4,7.5,7.5v60
                                                    c0,4.1-3.4,7.5-7.5,7.5c-6.2,0-11.2,5-11.2,11.2v90c0,6.2,5,11.3,11.2,11.3H1001.2z'/>
                                                </g>
                                            </g>
                                            <path class='st0' d='M1207.4,262.9c0-17.5,13.2-30.7,30.1-30.7c16.7,0,30,13.2,30,30.7c0,17.8-13.2,30.9-30,30.9
                                            C1220.7,293.8,1207.4,280.7,1207.4,262.9z M1237.6,300c20.2,0,37.4-15.7,37.4-37.1c0-21.2-17.2-36.9-37.4-36.9
                                            c-20.4,0-37.6,15.7-37.6,36.9C1200,284.3,1217.2,300,1237.6,300z M1230.9,265.5h6.5l9.9,16.3h6.4l-10.7-16.5
                                            c5.5-0.7,9.7-3.6,9.7-10.3c0-7.4-4.4-10.7-13.3-10.7h-14.3v37.6h5.7V265.5z M1230.9,260.7V249h7.7c4,0,8.2,0.9,8.2,5.5
                                            c0,5.8-4.3,6.1-9.1,6.1H1230.9z'/>
                                        </svg></td>
                                        <td style='text-align:right;'><b>" . strtoupper($data["Language"]) . "</b></td>
                                    </tr>
                                </table>
                            </section>
                        </div>
                    </div>
                </body>";


    $toPrint = $toPrint . "</html>";
    $mpdf = new Mpdf(['margin_top' => 0,
        'margin_right' => 0,
        'margin_bottom' => 0,
        'margin_left' => 0]);;
    $mpdf->WriteHTML($toPrint);

//// Save to a file
//    $file_location = "output.pdf";
//    $mpdf->Output($file_location, 'F');  // 'F' - safe file

    $toPrint = $mpdf->Output('', 'S'); // 'S' - return the document as a string

//// To send to the browser:
//    $mpdf->Output();

// Set a timeout on the stream
    stream_set_timeout($fp, 10); // set timeout to 2 seconds

// Send data to the printer
    fputs($fp, $toPrint);
    sleep(5);
// Get the response from the printer, if any
    $response = fgets($fp, 1024);

    $info = stream_get_meta_data($fp);
//    if ($info['timed_out']) {
//        echo 'Connection timed out!';
//    }

// Close the connection
    fclose($fp);
    return array(0, "printSuccess");

// Do something with the response
//    echo $response;
}

?>
