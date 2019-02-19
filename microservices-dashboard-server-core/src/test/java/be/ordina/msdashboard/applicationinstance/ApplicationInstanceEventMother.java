package be.ordina.msdashboard.applicationinstance;

import java.net.URI;

import be.ordina.msdashboard.applicationinstance.events.ApplicationInstanceCreated;

/**
 * @author Tim Ysewyn
 */
public final class ApplicationInstanceEventMother {

	private ApplicationInstanceEventMother() {
	}

	public static ApplicationInstanceCreated applicationInstanceCreated(String id) {
		return (ApplicationInstanceCreated) ApplicationInstance.Builder
				.withId(id)
				.baseUri(URI.create("http://localhost:8080"))
				.build()
				.getUncommittedChanges().get(0);
	}
}
