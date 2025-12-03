package com.appdev.betaems.websocket;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * WebSocket handler for real-time enrollment updates
 * Maintains list of connected admin clients and broadcasts enrollment events
 */
@Component
public class EnrollmentWebSocketHandler extends TextWebSocketHandler {

    // Thread-safe set of active WebSocket sessions
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("New WebSocket connection established. Total connections: " + sessions.size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Client can send messages (e.g., subscription requests)
        String payload = message.getPayload();
        System.out.println("Received message: " + payload);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("WebSocket connection closed. Remaining connections: " + sessions.size());
    }

    /**
     * Broadcast enrollment event to all connected admin clients
     * Called whenever a student successfully enrolls in a course
     * 
     * @param enrollmentEvent JSON message containing enrollment details
     */
    public void broadcastEnrollmentEvent(String enrollmentEvent) {
        TextMessage message = new TextMessage(enrollmentEvent);
        for (WebSocketSession session : sessions) {
            try {
                if (session.isOpen()) {
                    session.sendMessage(message);
                }
            } catch (IOException e) {
                System.err.println("Error sending WebSocket message: " + e.getMessage());
            }
        }
    }

    /**
     * Get the number of currently connected admin clients
     */
    public int getConnectedClientsCount() {
        return sessions.size();
    }
}
