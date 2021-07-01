package com.pruebamodulo;

import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.util.concurrent.Callable;

public class Scanner implements Callable<Boolean> {

    private String address;
    private int port;
    private int time;

    Scanner(String address, int port, int time)
    {
        this.address = address;
        this.port = port;
        this.time = time;
    }


    public Boolean call() {
        try {
            SocketAddress sa = new InetSocketAddress(this.address, this.port);
            Socket socket = new Socket();
            if(this.port == 8080) {
                socket.connect(sa, 2000);
                socket.close();
                return true;
            }

            if(this.port == 80) {
                socket.connect(sa, 2000);
                socket.close();
                return true;
            }
            
            socket.connect(sa, this.time);

            socket.close();
            return true;
        } catch(Exception e) {
            return false;
        }
    }


    public int getPort() {
        return port;
    }

    public void setTime(int newTime) {
        this.time = newTime;
    }


}
