package be.ordina.msdashboard.events;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.context.ApplicationEvent;

/**
 * Event that is thrown whenever a known service instance is deregistered.
 *
 * @author Tim Ysewyn
 */
public class ServiceInstanceDeregistered extends ApplicationEvent {

	public ServiceInstanceDeregistered(ServiceInstance serviceInstance) {
		super(serviceInstance);
	}

}
