<?php
/**
* PDO Session Handler
* Store session data to database using PDO.
*
* @author		H.Chihoon
* @copyright	2019 Payw
*/

namespace Readigm\Base\Http\Session;

class PDOSessionHandler implements \SessionHandlerInterface
{
	/**
	 * Database connection (PDO)
	 *
	 * @var \PDO
	 */
	protected $conn;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @param \PDO 	$conn
	 * @param array $config
	 */
	public function __construct(\PDO $conn, array $config)
	{
		$this->conn = $conn;
		$this->config = $config;
	}

	/**
	 * Initialize session.
	 *
	 * @param  string	$savePath
	 * @param  string	$sessionName
	 *
	 * @return bool
	 */
	public function open($savePath, $sessionName)
    {
		return true;
    }

	/**
	 * Close the session.
	 *
	 * @return bool
	 */
    public function close()
    {
        return true;
    }

	/**
	 * Read unexpired session data.
	 *
	 * @param  string	$id		Session id
	 *
	 * @return string	Session data
	 */
    public function read($id)
    {
		$stmt = $this->conn->prepare(
			"SELECT data FROM {$this->config['session_table']}
			WHERE id = :id
 			AND (UNIX_TIMESTAMP(creation_dt) + :lifetime) > :currtime"
		);
		$query_params = array(
			':id' => $id,
			':lifetime' => $this->config['cookie_params']['lifetime'],
			':currtime' => time()
		);
		$stmt->execute($query_params);

		if ($stmt->rowCount() == 0) {
			return "";
		}

		return $stmt->fetchColumn();
    }

	/**
	 * Write session data.
	 * If already exist session id, update it.
	 *
	 * @param  string $id		Session id
	 * @param  string $data		Session data
	 *
	 * @return bool
	 */
    public function write($id, $data)
    {
		$stmt = $this->conn->prepare(
			"INSERT INTO {$this->config['session_table']}
			(id, data)
			VALUES (:id, :data)
			ON DUPLICATE KEY
 			UPDATE data = :updated_data, touched_dt = :updated_touched_dt"
		);
		$query_params = array(
			':id' => $id,
			':data' => $data,
			':updated_data' => $data,
			':updated_touched_dt' => date("Y-m-d H:i:s")
		);
		if (!$stmt->execute($query_params)) {
			return false;
		}

		return true;
    }

	/**
	 * Destroy a session.
	 *
	 * @param  string $id	Session id
	 *
	 * @return bool
	 */
    public function destroy($id)
    {
		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['session_table']}
			WHERE id = ?"
		);
		$stmt->execute([$id]);

        return $stmt->rowCount() == 1;
    }

	/**
	 * Cleanup old sessions.
	 * Delete the session that no longer appears to be in use.
	 *
	 * @param  int $maxlifetime		Session garbage collector max lifetime
	 *
	 * @return bool
	 */
    public function gc($maxlifetime)
    {
		$stmt = $this->conn->prepare(
			"DELETE FROM {$this->config['session_table']}
			WHERE (UNIX_TIMESTAMP(touched_dt) + :maxlifetime) < :currtime"
		);
		$query_params = array(
			':maxlifetime' => $maxlifetime,
			':currtime' => time()
		);
		$stmt->execute($query_params);

        if ($stmt->rowCount() > 0) {
			return true;
		}

		return false;
    }
}
