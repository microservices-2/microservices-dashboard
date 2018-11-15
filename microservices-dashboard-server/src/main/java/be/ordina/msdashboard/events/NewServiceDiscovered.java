package be.ordina.msdashboard.events;

import org.springframework.context.ApplicationEvent;

/**
 * Event that is thrown whenever there is a new service discovered.
 *
 * @author Tim Ysewyn
 */
public class NewServiceDiscovered extends ApplicationEvent {

	public NewServiceDiscovered(String serviceName) {
		super(serviceName);
	}

}
