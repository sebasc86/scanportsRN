package com.pruebamodulo;

import java.net.InetAddress;
import java.util.concurrent.Callable;

public class RecheableIp implements Callable<Boolean> {

    private String address;

    RecheableIp(String address)
    {
        this.address = address;
    }


    public Boolean call() {
        try {

            InetAddress a = (InetAddress) InetAddress.getByName(address);
            if (a.isReachable(100)) {
                return true;
            }
            return false;
        } catch(Exception e) {
            return false;
        }
    }

    public String getAddress() {
        return address;
    }
}
