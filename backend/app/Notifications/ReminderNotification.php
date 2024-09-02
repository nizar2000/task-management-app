<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Reminder;

class ReminderNotification extends Notification
{
    use Queueable;

    protected $reminder;

    public function __construct(Reminder $reminder)
    {
        $this->reminder = $reminder;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Your reminder for ' . $this->reminder->task->name . ' is due!',
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('Your reminder for ' . $this->reminder->task->name . ' is due!')
            ->action('View Task', url('/tasks/' . $this->reminder->task->id));
    }
}
