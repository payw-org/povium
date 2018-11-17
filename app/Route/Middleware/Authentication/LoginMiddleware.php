<?php
/**
 * Middleware for login.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Authentication;

use Povium\Route\Middleware\AbstractAjaxMiddleware;
use Povium\Route\Middleware\RefererCheckerInterface;
use Povium\Security\Authentication\Controller\LoginController;
use Povium\Base\Routing\Validator\RedirectURIValidator;

class LoginMiddleware extends AbstractAjaxMiddleware implements RefererCheckerInterface
{
    /**
     * @var LoginController
     */
    protected $loginController;

    /**
     * @var RedirectURIValidator
     */
    protected $redirectURIValidator;

    /**
     * @param LoginController       $login_controller
     * @param RedirectURIValidator  $redirect_uri_validator
     */
    public function __construct(
        LoginController $login_controller,
        RedirectURIValidator $redirect_uri_validator
    ) {
        $this->loginController = $login_controller;
        $this->redirectURIValidator = $redirect_uri_validator;
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

        return;
    }

	/**
	 * {@inheritdoc}
	 *
	 * @return string|false		If valid redirect uri in referer query, return it.
	 */
    public function checkReferer()
	{
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
