<?php
// Needs to be run locally in XAMPP http://localhost/skoleni/backend.php
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'skoleni';

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function fetchData() {
    global $conn;

    $sql = "SELECT * FROM skoleni.data ORDER BY dtm_create DESC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
    } else {
        echo json_encode(array());
    }
}

function insertData($data) {
    global $conn;

    $currentDate = date('Y-m-d H:i:s');
    $sql = "INSERT INTO skoleni.data (motor_current, open_pressure, switch_pressure, flow, command_id, pump_id, dtm_create)
            VALUES ({$data['motor_current']}, {$data['open_pressure']}, {$data['switch_pressure']}, {$data['flow']}, '{$data['command_id']}', '{$data['pump_id']}', '{$currentDate}')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array('success' => true));
    } else {
        echo json_encode(array('success' => false, 'error' => $conn->error));
    }
}
function deleteData($id) {
    global $conn;

    $sql = "DELETE FROM skoleni.data WHERE id = {$id}";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array('success' => true));
    } else {
        echo json_encode(array('success' => false, 'error' => $conn->error));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($_GET['action'] === 'fetchData') {
        fetchData();
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['action'] === 'insertData' && isset($_POST["data"])) {
        insertData(json_decode($_POST["data"], true));
    }
    elseif ($_POST['action'] === 'deleteData' && isset($_POST["id"])) {
        deleteData($_POST['id']);
    }
}
?>
