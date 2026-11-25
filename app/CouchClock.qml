import QtQuick 2.12
import "."

Item {
    id: clock
    property string scene: ''
    property date time: new Date()
    property bool use24Hour: false
    property string weather: ''
    readonly property bool lightSky: scene === 'fog'
    readonly property color ink: lightSky ? '#344752' : '#f0f5ff'
    readonly property color outline: lightSky ? '#35ffffff' : '#85000000'

    Column {
        anchors.horizontalCenter: parent.horizontalCenter
        y: clock.scene === 'fog' || clock.scene === 'dawn' ? 275 : clock.scene === 'water' ? 205 : 155
        spacing: 0

        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: Qt.formatDate(clock.time, 'dddd, MMMM d')
            font.family: Style.font
            font.pixelSize: 33
            color: clock.ink
            style: Text.Outline
            styleColor: clock.outline
        }
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: clock.weather
            opacity: text === '' ? 0 : 1
            font.family: Style.font
            font.pixelSize: 26
            color: clock.ink
            style: Text.Outline
            styleColor: clock.outline
        }
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: Qt.formatTime(clock.time, clock.use24Hour ? 'HH:mm' : 'h:mm AP')
            font.family: Style.font
            font.weight: Font.DemiBold
            font.pixelSize: 175
            color: clock.ink
            style: Text.Outline
            styleColor: clock.outline
        }
    }

    Image {
        anchors.fill: parent
        source: clock.visible && clock.scene !== '' && clock.scene !== 'water'
                ? 'couch-scenes/scene-' + clock.scene + '-fg.png' : ''
        asynchronous: true
    }
}
