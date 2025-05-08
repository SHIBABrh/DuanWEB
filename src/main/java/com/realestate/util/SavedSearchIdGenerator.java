package com.realestate.util;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.util.concurrent.atomic.AtomicInteger;

public class SavedSearchIdGenerator implements IdentifierGenerator {
    private static final String ID_PREFIX = "SRCH";
    private static final AtomicInteger counter = new AtomicInteger(1);

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        return ID_PREFIX + String.format("%03d", counter.getAndIncrement());
    }
} 