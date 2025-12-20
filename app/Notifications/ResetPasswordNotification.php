<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $count = config('auth.passwords.'.config('auth.defaults.passwords').'.expire');

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->greeting('Halo!')
            ->line('Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.')
            ->action('Atur Ulang Password', url(route('password.reset', [
                'token' => $this->token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false)))
            ->line('Link reset password ini akan kadaluwarsa dalam '.$count.' menit. Jika Anda tidak meminta reset password, tidak ada tindakan lebih lanjut yang diperlukan.');
    }
}
