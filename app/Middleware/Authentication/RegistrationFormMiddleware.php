<?php
/**
 * Middleware for validating registration form.
 *
 * @author		H.Chihoon
 * @copyright	2018 DesignAndDevelop
 */

namespace Povium\Middleware\Authentication;

use Povium\Middleware\AbstractAjaxMiddleware;
use Povium\Security\Validator\UserInfo\ReadableIDValidator;
use Povium\Security\Validator\UserInfo\NameValidator;
use Povium\Security\Validator\UserInfo\PasswordValidator;

class RegistrationFormMiddleware extends AbstractAjaxMiddleware
{
    /**
     * @var ReadableIDValidator
     */
    protected $readableIDValidator;

    /**
     * @var NameValidator
     */
    protected $nameValidator;

    /**
     * @var PasswordValidator
     */
    protected $passwordValidator;

    /**
     * @param ReadableIDValidator   $readable_id_validator
     * @param NameValidator         $name_validator
     * @param PasswordValidator     $password_validator
     */
    public function __construct(
        ReadableIDValidator $readable_id_validator,
        NameValidator $name_validator,
        PasswordValidator $password_validator
    ) {
        $this->readableIDValidator = $readable_id_validator;
        $this->nameValidator = $name_validator;
        $this->passwordValidator = $password_validator;
    }

    /**
     * Receive registration form and validate it.
     */
    public function validateRegistrationForm()
    {
        $return = array(
            'readable_id_return' => [
                'err' => true,
                'msg' => ''
            ],

            'name_return' => [
                'err' => true,
                'msg' => ''
            ],

            'password_return' => [
                'err' => true,
                'msg' => '',
                'strength' => 0
            ]
        );

        /* Receive registration form */

        $registration_form = $this->receiveAjaxData();
        $readable_id = $registration_form['readable_id'];
        $name = $registration_form['name'];
        $password = $registration_form['password'];

        /* Validate register form */

        $validate_readable_id = $this->readableIDValidator->validate($readable_id, true);
        $return['readable_id_return']['err'] = $validate_readable_id['err'];
        $return['readable_id_return']['msg'] = $validate_readable_id['msg'];

        $validate_name = $this->nameValidator->validate($name, true);
        $return['name_return']['err'] = $validate_name['err'];
        $return['name_return']['msg'] = $validate_name['msg'];

        $validate_password = $this->passwordValidator->validate($password);
        $return['password_return']['err'] = $validate_password['err'];
        $return['password_return']['msg'] = $validate_password['msg'];

        if (!$return['password_return']['err']) {
            $return['password_return']['strength'] = $this->passwordValidator->getPasswordStrength($password);
        }

        $this->sendAjaxData($return);

        return;
    }
}
