import { workspace, StatusBarItem, window, StatusBarAlignment } from 'vscode';

export default class Timer {
  private _statusBarItem: StatusBarItem;
  private _timer: NodeJS.Timer;

  constructor() {
    if (!this._statusBarItem) {
      this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
      this._statusBarItem.text = '00:00';
    }
  }

  public get alarmMessage(): string {
    let config = workspace.getConfiguration('simpleTimer');
    if (config.showAlarm) {
      return config.alarmMessage;
    } else {
      return null;
    }
  }

  public start(time: number) {
    this._statusBarItem.text = `${time}:00`;
    this._statusBarItem.show();

    let deadline = new Date(new Date().getTime() + time * 60000);

    this._timer = setInterval(() => {
      let t = this.getTimeRemaining(deadline);

      this._statusBarItem.text = `${this._zeroBase(t.minutes)}:${this._zeroBase(
        t.seconds
      )}`;

      if (t.total <= 0) {
        clearInterval(this._timer);
        this._statusBarItem.hide();

        if (this.alarmMessage) {
          window.showInformationMessage(this.alarmMessage);
        }
      }
    }, 1000);
  }

  public stop() {
    clearInterval(this._timer);
    if (this._statusBarItem) {
      this._statusBarItem.hide();
    }
  }

  private getTimeRemaining(endTime) {
    let t = Date.parse(endTime) - Date.parse(new Date().toString());
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    return {
      total: t,
      minutes: minutes,
      seconds: seconds
    };
  }

  private _zeroBase(value) {
    return value < 10 ? `0${value}` : value;
  }
}
