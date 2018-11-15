package be.ordina.msdashboard.events;

import org.springframework.context.ApplicationEvent;

/**
 * Event that is thrown whenever a known service is deregistered.
 *
 * @author Tim Ysewyn
 */
public class ServiceDeregistered extends ApplicationEvent {

	public ServiceDeregistered(String serviceName) {
		super(serviceName);
	}

}
