package com.pruebamodulo;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.stealthcopter.networktools.ARPInfo;


import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import jcifs.netbios.NbtAddress;

public class InetStatusModuleManager extends ReactContextBaseJavaModule {
    public InetStatusModuleManager(ReactApplicationContext reactContext) {
            super(reactContext);
    }


    @Override
    public String getName() {
        return "ConnectionStatusModule";
    }


    @RequiresApi(api = Build.VERSION_CODES.N)
    @ReactMethod
    public void hostName(String ip, Promise promise) throws UnknownHostException, Exception{
            try {
                InetAddress a = (InetAddress) InetAddress.getByName(ip);
                String hostname = a.getHostName();
                promise.resolve(hostname);

            } catch (UnknownHostException e) {
                e.printStackTrace();
            }  catch (Exception e) {
                e.printStackTrace();
            }

    }

    @ReactMethod
    public void pingStatus(String ip, Promise promise) throws UnknownHostException, Exception{
            try {
                InetAddress a = (InetAddress) InetAddress.getByName(ip);
                String hostname = a.getHostAddress();
                if (a.isReachable(200)) {
                    promise.resolve(hostname);
                } 
               
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }  catch (Exception e) {
                e.printStackTrace();
            }

    }



    @ReactMethod
    public void connectionStatusNtb(String ip, Promise promise) throws UnknownHostException, Exception{
        try {
            
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress(ip, 445), 100);

            if (socket.isConnected()) {
                String a = NbtAddress.getAllByAddress(ip)[0].firstCalledName();
                socket.close();
                promise.resolve(a);
            } else {
                socket.close();
                promise.resolve("null");

            }

        } catch (UnknownHostException e) {
            e.printStackTrace();
        }  catch (Exception e) {
            e.printStackTrace();
        }

    }


    @ReactMethod
    public void findMac(String ip, Promise promise) {
        String macAddress = ARPInfo.getMACFromIPAddress(ip);
        promise.resolve(macAddress);
    }

    @ReactMethod
    public void findPortsSoft(String ip, int time, Promise promise) throws Exception {


        try {
            int array[] = {
                    1,5,7,9,11,13,17,18,19,20,21,22,23,25,37,39,42,43,49,50,53,67,68,69,70,71,79,80,81,82,88,101,102,105,107,109,110,111,112,113,115,117,119,123,137,138,139,143,161,162,163,177,179,194,199,201,209,210,213,220,369,370,389,427,443,444,445,464,500,512,513,514,515,517,518,520,521,525,530,531,532,533,540,543,544,546,547,548,554,556,563,587,631,636,674,694,749,750,873,992,993,995,1080,1433,1434,1494,1512,1524,1701,1719,1720,1812,1813,1985,2008,2010,2049,2102,2103,2104,2401,2809,3306,4321,5040,5999,6000,8080,8081,11371,13720,13724,13782,13783,22273,23399,25565,260000,27017,33434
            };

            ExecutorService ex = Executors.newCachedThreadPool();
            WritableArray promiseArray=Arguments.createArray();
            List<Scanner> tasks = new ArrayList<>();
            
            for (int i = 0; i < array.length; i++) {
                tasks.add(new Scanner(ip, array[i], time));
            }

            List<Future<Boolean>> list = ex.invokeAll(tasks);
            String[] returnArray = new String[tasks.size()];
            // //returnArray = tasks.toArray(returnArray);

            
             for(int i=0;i<returnArray.length;i++){
                 if (list.get(i).get()) {
                     promiseArray.pushInt(tasks.get(i).getPort());
                     //promise.resolve(tasks.get(i).getPort());
                     //System.out.printf("Port is in use: %d", tasks.get(i).getPort());
                 } else {
                     //System.out.printf("Port is not in use: %d", tasks.get(i).getPort());
                 }

             }

            promise.resolve(promiseArray);
            ex.shutdown();
        }
        catch(Exception e){
            promise.reject(e);
        }

    }

    @ReactMethod
    public void findPortsFull(String ip, int time, Promise promise) throws Exception {



        try {
            ExecutorService ex = Executors.newFixedThreadPool(2000);
            WritableArray promiseArray=Arguments.createArray();
            List<Scanner> tasks = new ArrayList<>();

            for (int i = 0; i < 65535; i++) {
                tasks.add(new Scanner(ip, i, time));
            }

            List<Future<Boolean>> list = ex.invokeAll(tasks);
            String[] returnArray = new String[tasks.size()];
            // //returnArray = tasks.toArray(returnArray);


            for(int i=0;i<returnArray.length;i++){
                if (list.get(i).get()) {
                    promiseArray.pushInt(tasks.get(i).getPort());

                } else {

                }

            }


            ex.shutdown();
            promise.resolve(promiseArray);

        }
        catch(Exception e){
            promise.reject(e);
        }

    }

    @ReactMethod
    public void scanIp(ReadableArray ips, Promise promise) throws Exception {

        try {
            ExecutorService ex = Executors.newCachedThreadPool();
            List<RecheableIp> tasks = new ArrayList<>();
            for (int i = 0; i < ips.size(); i++) {
                tasks.add(new RecheableIp(ips.getString(i)));
            }
            List<Future<Boolean>> list = ex.invokeAll(tasks);

            String[] returnArray = new String[ips.size()];

            WritableArray promiseArray=Arguments.createArray();
            for(int i=0;i<returnArray.length;i++){
                if (list.get(i).get()) {
                    promiseArray.pushString(tasks.get(i).getAddress());
                }

            }

            promise.resolve(promiseArray);
            ex.shutdown();
        }
        catch(Exception e){
            promise.reject(e);
        }

    }

    @ReactMethod
    public void scanIpPrueba(String ip, Promise promise) throws Exception {

        try {
            ExecutorService ex = Executors.newCachedThreadPool();
            RecheableIp task = new RecheableIp(ip);
            Future<Boolean> future = ex.submit(task);
            Boolean result = future.get();




            promise.resolve(result);
            ex.shutdown();
        }
        catch(Exception e){
            promise.reject(e);
        }

    }


}
