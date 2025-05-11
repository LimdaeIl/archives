package thread.start;

import static util.MyLogger.log;

import thread.start.InnerRunnableMainV1.MyRunnable;

public class InnerRunnableMainV2 {
  public static void main(String[] args) {
    log("main() start");

    Runnable runnable = new Runnable() {

      @Override
      public void run() {
        log("run()");
      }

    };

    Thread thread = new Thread(runnable);
    thread.start();

    log("main() end");

  }
}
