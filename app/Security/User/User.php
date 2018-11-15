<?php
/**
* User class is the user implementation.
*
* @author		H.Chihoon
* @copyright	2018 DesignAndDevelop
*/

namespace Povium\Security\User;

class User
{
	/**
	 * @var int
	 */
	protected $id;

	/**
	 * @var string
	 */
	protected $readableID;

	/**
	 * @var string
	 */
	protected $name;

	/**
	 * @var string
	 */
	protected $password;

	/**
	 * @var bool
	 */
	protected $isVerified;

	/**
	 * @var bool
	 */
	protected $isActive;

	/**
	 * @var string	Datetime
	 */
	protected $registrationDt;

	/**
	 * @var string	Datetime
	 */
	protected $lastLoginDt;

	/**
	 * @var string
	 */
	protected $profileImage;

	/**
	 * @var string|null
	 */
	protected $email;

	/**
	 * @var string|null
	 */
	protected $bio;

	/**
	 * @param int    		$id
	 * @param string 		$readable_id
	 * @param string 		$name
	 * @param string 		$password
	 * @param bool   		$is_verified
	 * @param bool   		$is_active
	 * @param string 		$registration_dt
	 * @param string 		$last_login_dt
	 * @param string 		$profile_image
	 * @param string|null 	$email
	 * @param string|null 	$bio
	 */
	public function __construct(
		int $id,
 		string $readable_id,
		string $name,
		string $password,
		bool $is_verified,
		bool $is_active,
		string $registration_dt,
		string $last_login_dt,
		string $profile_image,
		?string $email,
		?string $bio
	) {
		$this->id = $id;
		$this->readableID = $readable_id;
		$this->name = $name;
		$this->password = $password;
		$this->isVerified = $is_verified;
		$this->isActive = $is_active;
		$this->registrationDt = $registration_dt;
		$this->lastLoginDt = $last_login_dt;
		$this->profileImage = $profile_image;
		$this->email = $email;
		$this->bio = $bio;
	}

	/**
	 * @return	int
	 */
	public function getID()
	{
		return $this->id;
	}

	/**
	 * @return	string
	 */
	public function getReadableID()
	{
		return $this->readableID;
	}

	/**
	 * @return	string
	 */
	public function getName()
	{
		return $this->name;
	}

	/**
	 * @return	string
	 */
	public function getPassword()
	{
		return $this->password;
	}

	/**
	 * @return	bool
	 */
	public function isVerified()
	{
		return $this->isVerified;
	}

	/**
	 * @return	bool
	 */
	public function isActive()
	{
		return $this->isActive;
	}

	/**
	 * @return	string	Datetime
	 */
	public function getRegistrationDt()
	{
		return $this->registrationDt;
	}

	/**
	 * @return	string	Datetime
	 */
	public function getLastLoginDt()
	{
		return $this->lastLoginDt;
	}

	/**
	 * @return	string
	 */
	public function getProfileImage()
	{
		return $this->profileImage;
	}

	/**
	 * @return	string|null
	 */
	public function getEmail()
	{
		return $this->email;
	}

	/**
	 * @return	string|null
	 */
	public function getBio()
	{
		return $this->bio;
	}
}
