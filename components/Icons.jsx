import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const ForwardArrow = (props) => (
    <Entypo name="arrow-bold-up" size={80} color="black" {...props} />
)

export const BackArrow = (props) => (
    <Entypo name="arrow-bold-down" size={80} color="black" {...props} />
)

export const LeftArrow = (props) => (
    <Entypo name="arrow-bold-left" size={24} color="black" {...props} />
)

export const RightArrow = (props) => (
    <Entypo name="arrow-bold-right" size={24} color="black" {...props} />
)

export const SpiderIcon = (props) => (
    <MaterialCommunityIcons name="spider-outline" size={24} color="black" {...props} />
)

export const TouchIcon = (props) => (
    <MaterialIcons name="touch-app" size={48} color="orange" {...props} />
)

export const PumpkinIcon = (props) => (
    <MaterialCommunityIcons name="halloween" size={24} color="black"  {...props} />
)