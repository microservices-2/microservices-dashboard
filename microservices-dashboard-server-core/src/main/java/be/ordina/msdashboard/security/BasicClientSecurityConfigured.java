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

package be.ordina.msdashboard.security;

import org.springframework.boot.autoconfigure.condition.ConditionMessage;
import org.springframework.boot.autoconfigure.condition.ConditionOutcome;
import org.springframework.boot.autoconfigure.condition.SpringBootCondition;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotatedTypeMetadata;

/**
 * Condition that matches if the {@code ms-dashboard.security.client.basic} properties have been defined.
 *
 * @author Tim Ysewyn
 */
public final class BasicClientSecurityConfigured extends SpringBootCondition {

	private static final Bindable<BasicClientSecurityProperties> basicClientSecurityPropertiesBindable = Bindable
			.of(BasicClientSecurityProperties.class);

	@Override
	public ConditionOutcome getMatchOutcome(ConditionContext context,
			AnnotatedTypeMetadata metadata) {
		ConditionMessage.Builder message = ConditionMessage
				.forCondition("Basic Client Security Configured Condition");
		BasicClientSecurityProperties basicClientSecurityProperties =
				getBasicClientSecurityProperties(context.getEnvironment());
		if (basicClientSecurityProperties.isConfigured()) {
			return ConditionOutcome.match(message.because("Both the username and password have been configured"));
		}
		return ConditionOutcome.noMatch(message.because("Both the username and password should be configured"));
	}

	private BasicClientSecurityProperties getBasicClientSecurityProperties(Environment environment) {
		return Binder.get(environment).bind(BasicClientSecurityProperties.PREFIX,
				basicClientSecurityPropertiesBindable).orElse(new BasicClientSecurityProperties());
	}

}
