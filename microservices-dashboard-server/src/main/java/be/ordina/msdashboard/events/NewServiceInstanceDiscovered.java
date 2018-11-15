package be.ordina.msdashboard.events;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.context.ApplicationEvent;

/**
 * Event that is thrown whenever there is a new service instance discovered.
 *
 * @author Tim Ysewyn
 */
public class NewServiceInstanceDiscovered extends ApplicationEvent {

	public NewServiceInstanceDiscovered(ServiceInstance serviceInstance) {
		super(serviceInstance);
	}

}
