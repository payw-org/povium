<?php
/**
 * Abstract form for factory which is responsible for creating record manager instance.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Povium\Record\Factory;

use Povium\Base\Database\DBConnection;
use Povium\Base\Factory\AbstractChildFactory;

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
