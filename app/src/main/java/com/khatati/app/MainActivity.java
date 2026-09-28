package com.khatati.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Window;

public class MainActivity extends Activity {
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        Window w=getWindow();
        w.setStatusBarColor(android.graphics.Color.rgb(247,248,252));
        w.setNavigationBarColor(android.graphics.Color.rgb(247,248,252));
        WebView web=new WebView(this);
        web.setBackgroundColor(android.graphics.Color.WHITE);
        web.setWebViewClient(new WebViewClient());
        WebSettings s=web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        web.loadUrl("file:///android_asset/index.html");
        setContentView(web);
    }
}
