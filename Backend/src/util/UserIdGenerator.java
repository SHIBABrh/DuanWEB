package com.realestate.util;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Generator for user ID values
 */
public class UserIdGenerator {
    private static final String ID_PREFIX = "UID";
    private static final AtomicInteger counter = new AtomicInteger(1);

    /**
     * Generates a unique user ID
     * 
     * @return String ID in format "UIDxxx" where xxx is a sequential number
     */
    public String generate(Object session, Object object) {
        return ID_PREFIX + String.format("%03d", counter.getAndIncrement());
    }
} 