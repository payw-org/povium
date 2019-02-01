<?php
/**
 * Middleware for register.
 *
 * @author		H.Chihoon
 * @copyright	2019 Payw
 */

namespace Readigm\Http\Middleware\Authentication;

use Readigm\Http\Middleware\AbstractAjaxMiddleware;
use Readigm\Http\Middleware\Converter\CamelToSnakeConverter;
use Readigm\Http\Middleware\RefererCheckerInterface;
use Readigm\Http\Controller\Authentication\RegisterController;
use Readigm\Http\Controller\Authentication\LoginController;
use Readigm\Base\Routing\Validator\RedirectURIValidator;

class RegisterMiddleware extends AbstractAjaxMiddleware implements RefererCheckerInterface
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
     * @var RegisterController
     */
    protected $registerController;

	/**
	 * @param CamelToSnakeConverter	$camel_to_snake_converter
	 * @param RedirectURIValidator 	$redirect_uri_validator
	 * @param LoginController 		$login_controller
	 * @param RegisterController 	$register_controller
	 */
    public function __construct(
    	CamelToSnakeConverter $camel_to_snake_converter,
		RedirectURIValidator $redirect_uri_validator,
		LoginController $login_controller,
		RegisterController $register_controller
    ) {
    	parent::__construct($camel_to_snake_converter);
		$this->redirectURIValidator = $redirect_uri_validator;
		$this->loginController = $login_controller;
		$this->registerController = $register_controller;
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
