<?php
/**
 * Abstract form for factory which is responsible for creating record manager instance.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Base\Database\Factory;

use Readigm\Base\Database\DBConnection;
use Readigm\Base\Factory\AbstractChildFactory;

abstract class AbstractRecordManagerFactory extends AbstractChildFactory
{
	/**
	 * {@inheritdoc}
	 */
	protected function prepareArgs()
	{
		$conn = DBConnection::getInstance()->getConn();

		$this->args[] = $conn;
	}
}
