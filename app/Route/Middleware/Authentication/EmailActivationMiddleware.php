<?php
/**
 * Middleware for email activation.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Route\Middleware\Authentication;

use Povium\Security\Authentication\Controller\EmailActivationController;
use Povium\Base\Routing\Router;
use Povium\Security\User\User;
use Povium\Base\Http\Exception\ForbiddenHttpException;
use Povium\Base\Http\Exception\GoneHttpException;

class EmailActivationMiddleware
{
    /**
     * @var EmailActivationController
     */
    protected $emailActivationController;

    /**
     * @var Router
     */
    protected $router;

    /**
     * User who requested activation
     *
     * @var User
     */
    protected $user;

    /**
     * @param EmailActivationController $email_activation_controller
     * @param Router                    $router
     * @param User                      $user
     */
    public function __construct(
        EmailActivationController $email_activation_controller,
        Router $router,
        User $user
    ) {
        $this->emailActivationController = $email_activation_controller;
        $this->router = $router;
        $this->user = $user;
    }

    /**
     * Verify activation link.
     * Then activate the email address.
     *
     * @throws ForbiddenHttpException   If invalid activation request
     * @throws GoneHttpException        If activation request has already expired
     */
    public function activateEmail()
    {
        /* Get token from query */

        if (!isset($_GET['token'])) {
            throw new ForbiddenHttpException();
        } else {
            $token = $_GET['token'];
        }

        $email_activation_return = $this->emailActivationController->activateEmail($this->user, $token);

        if ($email_activation_return['err']) {
            switch ($email_activation_return['code']) {
                case EmailActivationController::USER_NOT_FOUND:
                    throw new GoneHttpException($email_activation_return['msg']);

                    break;
                case EmailActivationController::TOKEN_NOT_MATCH:
                    throw new ForbiddenHttpException($email_activation_return['msg']);

                    break;
                case EmailActivationController::REQUEST_EXPIRED:
                    throw new GoneHttpException($email_activation_return['msg']);

                    break;
            }
        } else {
            $this->router->redirect('/');	// @TODO: 홈에서 인증완료됨을 알리는 modal이 뜨도록 query 추가하기
        }
    }
}
