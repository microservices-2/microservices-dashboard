/*
 * Copyright 2015-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package be.ordina.msdashboard.api;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;

import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

/**
 * Assembler to create a {@link ApplicationInstanceResource resource} out of an {@link ApplicationInstance application instance}.
 *
 * @author Tim Ysewyn
 */
class ApplicationInstanceResourceAssembler extends ResourceAssemblerSupport<ApplicationInstance, ApplicationInstanceResource> {

	ApplicationInstanceResourceAssembler() {
		super(ApplicationInstanceController.class, ApplicationInstanceResource.class);
	}

	@Override
	public ApplicationInstanceResource toResource(ApplicationInstance applicationInstance) {
		return createResourceWithId(applicationInstance.getId(), applicationInstance);
	}
}
