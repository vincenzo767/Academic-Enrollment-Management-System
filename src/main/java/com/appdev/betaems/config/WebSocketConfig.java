package com.appdev.betaems.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import com.appdev.betaems.websocket.EnrollmentWebSocketHandler;

/**
 * WebSocket Configuration
 * Enables WebSocket support for real-time enrollment updates to admin dashboard
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private EnrollmentWebSocketHandler enrollmentWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(enrollmentWebSocketHandler, "/ws/enrollments")
                .setAllowedOrigins("*");
    }
}
