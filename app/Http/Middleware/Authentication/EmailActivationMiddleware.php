<?php
/**
 * Middleware for email activation.
 *
 * @author		H.Chihoon
 * @copyright	2018 Povium
 */

namespace Readigm\Http\Middleware\Authentication;

use Readigm\Http\Controller\Authentication\EmailActivationController;
use Readigm\Base\Routing\Router;
use Readigm\Http\Controller\Exception\RequestExpiredException;
use Readigm\Http\Controller\Exception\RequestNotFoundException;
use Readigm\Http\Controller\Exception\TokenNotMatchedException;
use Readigm\Security\User\User;
use Readigm\Base\Http\Exception\ForbiddenHttpException;
use Readigm\Base\Http\Exception\GoneHttpException;

class EmailActivationMiddleware
{
	/**
	 * @var Router
	 */
	protected $router;

	/**
     * @var EmailActivationController
     */
    protected $emailActivationController;

	/**
	 * @param Router 					$router
	 * @param EmailActivationController $email_activation_controller
	 */
    public function __construct(
		Router $router,
        EmailActivationController $email_activation_controller
    ) {
		$this->router = $router;
		$this->emailActivationController = $email_activation_controller;
    }

    /**
     * Verify activation link.
     * Then activate the email address.
	 *
	 * @param User	$user	User who requested activation
     *
     * @throws ForbiddenHttpException   If invalid activation request
     * @throws GoneHttpException		If activation request has already expired
     */
    public function activateEmail($user)
    {
        /* Get token from query */

        if (!isset($_GET['token'])) {
            throw new ForbiddenHttpException();
        } else {
            $token = $_GET['token'];
        }

        try {
			$email_activation_return = $this->emailActivationController->activateEmail($user, $token);

			if (!$email_activation_return['err']) {
				$this->router->redirect('/');	// @TODO: 홈에서 인증완료됨을 알리는 modal이 뜨도록 query 추가하기
			}
		} catch (RequestNotFoundException $e) {
			throw new GoneHttpException(
				$e->getMessage(),
				$e->getCode(),
				$e
			);
		} catch (TokenNotMatchedException $e) {
			throw new ForbiddenHttpException(
				$e->getMessage(),
				$e->getCode(),
				$e
			);
		} catch (RequestExpiredException $e) {
			throw new GoneHttpException(
				$e->getMessage(),
				$e->getCode(),
				$e
			);
		}
    }
}
