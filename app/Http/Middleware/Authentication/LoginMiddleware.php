<?php
/**
 * Middleware for login.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Authentication;

use Readigm\Http\Middleware\AbstractAjaxMiddleware;
use Readigm\Http\Middleware\Converter\CamelToSnakeConverter;
use Readigm\Http\Middleware\RefererCheckerInterface;
use Readigm\Http\Controller\Authentication\LoginController;
use Readigm\Base\Routing\Validator\RedirectURIValidator;

class LoginMiddleware extends AbstractAjaxMiddleware implements RefererCheckerInterface
{
	/**
     * @var RedirectURIValidator
     */
    protected $redirectURIValidator;

	/**
	 * @var LoginController
	 */
	protected $loginController;

	/**
	 * @param CamelToSnakeConverter	$camel_to_snake_converter
	 * @param RedirectURIValidator 	$redirect_uri_validator
	 * @param LoginController 		$login_controller
	 */
    public function __construct(
    	CamelToSnakeConverter $camel_to_snake_converter,
		RedirectURIValidator $redirect_uri_validator,
        LoginController $login_controller
    ) {
    	parent::__construct($camel_to_snake_converter);
		$this->redirectURIValidator = $redirect_uri_validator;
		$this->loginController = $login_controller;
	}

    /**
     * Receive login inputs and process login.
     */
    public function login()
    {
        $return = array(
            'err' => true,
            'msg' => '',
            'redirect' => null
        );

        /* Receive login inputs */

        $login_inputs = $this->receiveAjaxData();
        $identifier = $login_inputs['identifier'];
        $password = $login_inputs['password'];

        /* Process login and set redirect uri */

        $login_return = $this->loginController->login($identifier, $password);
        $return['err'] = $login_return['err'];
        $return['msg'] = $login_return['msg'];

        if ($return['err']) {   //  Login fail
            if ($return['msg'] == $this->loginController->getConfig()['msg']['account_inactive']) {
                //	@TODO: Set redirect url to reactivate user account.
            }
        } else {                //  Login success
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
