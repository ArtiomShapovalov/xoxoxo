import { SafeAreaView, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type MainScreenWrapperProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function MainScreenWrapper({ style, lightColor, darkColor, ...otherProps }: MainScreenWrapperProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <SafeAreaView style={[
    { 
      backgroundColor, 
      flex: 1,
    }, 
    style
  ]} {...otherProps} />;
}
