import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useNewApplicationStyle } from 'src/components/Application/NewApplication/NewApplication';
import { Icon } from 'src/submodules/iconlibrary/src';
import { MultistepTimelineProps } from '../NewApplicationUtils';


const MultistepTimeline: React.FC<MultistepTimelineProps> = ({
  steps,
  currentStep,
}) => {
  const styles = useNewApplicationStyle();
  const { theme } = useAppTheme();

  return (
    <View style={styles.timelineCard}>
      <View style={styles.timelineRow}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          const circleStyle = isCompleted
            ? styles.stepCircleCompleted
            : isActive
            ? styles.stepCircleActive
            : styles.stepCircleInactive;

          const iconColor = isCompleted
            ? theme.colors.textInverse
            : isActive
            ? theme.colors.surfaceInverse
            : theme.colors.textNeutral;

          const labelStyle = [
            styles.stepLabel,
            isActive || isCompleted
              ? styles.stepLabelActive
              : styles.stepLabelInactive,
          ];

          return (
            <React.Fragment key={step.key}>
              <View style={styles.timelineStep}>
                {/* Circle + connector row */}
                <View style={styles.timelineStepTop}>
                  {/* Left connector (not for first item) */}
                  {index > 0 && (
                    <View
                      style={[
                        styles.stepConnector,
                        index <= currentStep
                          ? styles.stepConnectorCompleted
                          : styles.stepConnectorInactive,
                      ]}
                    />
                  )}

                  {/* Step circle */}
                  <View style={[styles.stepCircle, circleStyle]}>
                    <Icon
                      name={step.icon as any}
                      size={16}
                      color={iconColor}
                    />
                  </View>

                  {/* Right connector (not for last item) */}
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.stepConnector,
                        index < currentStep
                          ? styles.stepConnectorCompleted
                          : styles.stepConnectorInactive,
                      ]}
                    />
                  )}
                </View>

                {/* Label below circle */}
                <Text style={labelStyle}>{step.label}</Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default MultistepTimeline;
