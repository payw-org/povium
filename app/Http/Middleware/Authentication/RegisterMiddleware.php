<?php
/**
 * Middleware for register.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Http\Middleware\Authentication;

use Povium\Http\Middleware\AbstractAjaxMiddleware;
use Povium\Http\Middleware\RefererCheckerInterface;
use Povium\Http\Controller\Authentication\RegisterController;
use Povium\Http\Controller\Authentication\LoginController;
use Povium\Base\Routing\Validator\RedirectURIValidator;

class RegisterMiddleware extends AbstractAjaxMiddleware implements RefererCheckerInterface
{
    /**
     * @var RegisterController
     */
    protected $registerController;

    /**
     * @var LoginController
     */
    protected $loginController;

    /**
     * @var RedirectURIValidator
     */
    protected $redirectURIValidator;

    /**
     * @param RegisterController    $register_controller
     * @param LoginController       $login_controller
     * @param RedirectURIValidator  $redirect_uri_validator
     */
    public function __construct(
        RegisterController $register_controller,
        LoginController $login_controller,
        RedirectURIValidator $redirect_uri_validator
    ) {
        $this->registerController = $register_controller;
        $this->loginController = $login_controller;
        $this->redirectURIValidator = $redirect_uri_validator;
    }

    /**
     * Receive register inputs and process register.
     */
    public function register()
    {
        $return = array(
            'err' => true,
            'msg' => '',
            'redirect' => null
        );

        /* Receive register inputs */

        $register_inputs = $this->receiveAjaxData();
        $readable_id = $register_inputs['readable_id'];
        $name = $register_inputs['name'];
        $password = $register_inputs['password'];

        /* Process register and set redirect uri */

        $register_return = $this->registerController->register($readable_id, $name, $password);
        $return['err'] = $register_return['err'];
        $return['msg'] = $register_return['msg'];

        if ($return['err']) {	//	Register fail

        } else {			 	//	Register success
            $this->loginController->login($readable_id, $password);

			//	Check referer and get redirect uri
			$redirect = $this->checkReferer();

			if ($redirect === false) {
				$return['redirect'] = '/';
			} else {
				$return['redirect'] = $redirect;
			}
        }

        $this->sendAjaxData($return);
    }

	/**
	 * {@inheritdoc}
	 *
	 * @return string|false		If valid redirect uri in referer query, return it.
	 */
	public function checkReferer()
	{
		if (!isset($_SERVER['HTTP_REFERER'])) {
			return false;
		}

		$referer_query = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);

		if (!isset($referer_query)) {
			return false;
		}

		parse_str($referer_query, $query_data);

		if (!isset($query_data['redirect'])) {
			return false;
		}

		if (!$this->redirectURIValidator->validate($query_data['redirect'])) {
			return false;
		}

		return $query_data['redirect'];
	}
}
