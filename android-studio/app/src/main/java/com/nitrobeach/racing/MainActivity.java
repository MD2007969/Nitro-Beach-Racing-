package com.nitrobeach.racing;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.ConsoleMessage;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.View;
public class MainActivity extends Activity {
  private WebView web;
  @Override public void onCreate(Bundle state) { super.onCreate(state);
    getWindow().getDecorView().setSystemUiVisibility(5894 | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
    web=new WebView(this); web.getSettings().setJavaScriptEnabled(true);
    web.getSettings().setDomStorageEnabled(true);
    web.getSettings().setAllowFileAccess(true);
    web.setWebChromeClient(new WebChromeClient() {
      @Override public boolean onConsoleMessage(ConsoleMessage message) {
        String detail = message.message() + " (" + message.sourceId() + ":" + message.lineNumber() + ")";
        if (message.messageLevel() == ConsoleMessage.MessageLevel.ERROR) {
          Log.e("NitroWebView", detail);
        } else {
          Log.d("NitroWebView", detail);
        }
        return true;
      }
    });
    web.setWebViewClient(new WebViewClient());
    setContentView(web); web.loadUrl("file:///android_asset/index.html");
  }
  @Override protected void onDestroy() { web.destroy(); super.onDestroy(); }
}
