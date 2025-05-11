package thread.start.test;

import static util.MyLogger.log;

public class StartTest4Main {
  public static void main(String[] args) {
    Thread thread1 = new Thread(new PrintWork("A", 1000), "Thread-A");
    Thread thread2 = new Thread(new PrintWork("B", 500), "Thread-B");
    thread1.start();
    thread2.start();
  }

  static class PrintWork implements Runnable {

    private final String content;
    private final int millis;

    public PrintWork(String content, int millis) {
      this.content = content;
      this.millis = millis;
    }

    @Override
    public void run() {
      while (true) {
        log(content);
        try {
          Thread.sleep(millis);
        } catch (InterruptedException e) {
          throw new RuntimeException(e);
        }

      }
    }
  }

}
