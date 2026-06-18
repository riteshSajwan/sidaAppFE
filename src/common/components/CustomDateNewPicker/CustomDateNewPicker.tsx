import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useDateStyle } from 'src/common/components/CustomDateNewPicker/CustomDateStyle';
import { useCalendarTheme } from 'src/common/components/CustomDateNewPicker/CustomDateUtil';
import { setCalendarLocale } from 'src/common/components/CustomDateNewPicker/locale/calendarLocaleConfig';
import { useAppTheme } from 'src/common/context/AppTheme';
import { getAsyncStorageItem } from 'src/common/utils/getAsyncStorageItem';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';
import { translateMessage } from 'src/i18n/createTranslation';
import { Icon } from 'src/submodules/iconlibrary/src';
interface ICustomDatePickerProps {
    date: string | number | null;
    onDateSelect: (date: string) => void;
    maxDate?: string;
    minDate?: string;
    placeholder: string;
    markedDates?: Record<string, { selected?: boolean; marked?: boolean; selectedColor?: string }>;
    showIconOnly?: boolean;
    disabled?: boolean;
    onOpen?: () => void;
    waitForOpenSignal?: boolean;
    openSignal?: number;
    disableYearDropdown?: boolean;
    riderName?: string | null;
    riderId?: number | null;
}

const CustomInputDatePicker: React.FC<ICustomDatePickerProps> = ({
    date = '',
    onDateSelect,
    maxDate,
    minDate,
    placeholder,
    markedDates,
    showIconOnly = false,
    disabled = false,
    onOpen,
    waitForOpenSignal = false,
    openSignal = 0,
    disableYearDropdown = false,
    riderName,
    riderId,
}) => {
    const styles = useDateStyle();
    const { theme } = useAppTheme();
    const calendarTheme = useCalendarTheme();
    const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
    const [isYearDropdownVisible, setIsYearDropdownVisible] = useState<boolean>(false);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [calendarDate, setCalendarDate] = useState<string>(date ? String(date) : new Date().toISOString().split('T')[0]);
    const { t: TranslateMessage } = useTranslation();
    const currentYear = new Date().getFullYear();
    const pastYears = 90;
    const futureYears = 50;
    const years = Array.from({ length: pastYears + futureYears + 1 }, (_, i) => currentYear - pastYears + i);
    const language =  getAsyncStorageItem(AsyncStorageKey.LANGUAGE_KEY);
    const resolvedDate = date ? String(date) : new Date().toISOString().split('T')[0];
    const resolvedYear = Number.parseInt(resolvedDate.split('-')[0] || `${currentYear}`, 10) || currentYear;

    const handleOpenCalendar = () => {
        if (disabled) {
            return;
        }
        onOpen?.();
        if (waitForOpenSignal) {
            return;
        }
        setIsYearDropdownVisible(false);
        setSelectedYear(resolvedYear);
        setCalendarDate(resolvedDate);
        setIsCalendarVisible(true);
    };

    const handleYearSelect = (year: number) => {
        if (disableYearDropdown) {
            return;
        }
        setSelectedYear(year);
        setCalendarDate(`${year}-01-01`); // Update calendar to selected year
        setIsYearDropdownVisible(false); // Close dropdown after selection
    };
    
    useEffect(() => {
    const init = () => {
        language.then((lang) => {
        if (lang) {
            setCalendarLocale();
        }
        });
    };

    init();
    }, [language]);

    useEffect(() => {
        if (!waitForOpenSignal || !openSignal) {
            return;
        }

        setIsYearDropdownVisible(false);
        setSelectedYear(resolvedYear);
        setCalendarDate(resolvedDate);
        setIsCalendarVisible(true);
    }, [openSignal, resolvedDate, resolvedYear, waitForOpenSignal]);


    const handleCloseCalendar = () => {
        setIsCalendarVisible(false);
        setIsYearDropdownVisible(false);
        setSelectedYear(new Date().getFullYear()); // Reset to current year
        setCalendarDate(`${new Date()}`); // Reset calendar view
    };

    function renderDateField() {
        return (
            <TouchableOpacity
                onPress={handleOpenCalendar}
                style={styles.inputContainer}
            >
                <Text style={[styles.inputText, { color: date ? theme.colors.textNeutral : theme.colors.textBodyLight }]}>{date || placeholder}</Text>
                <Pressable onPress={handleOpenCalendar} disabled={disabled}>
                    <Icon name='calendar' size={20} color={theme.colors.iconBase} />
                </Pressable>
            </TouchableOpacity>

        )
    }

    function renderIconTrigger() {
        return (
            <Pressable onPress={handleOpenCalendar} disabled={disabled} style={styles.iconOnlyTrigger}>
                <Icon name='calendar' size={18} color={disabled ? theme.colors.iconDisabled : theme.colors.iconBase} />
            </Pressable>
        );
    }

    function renderYearSelector() {
        if (disableYearDropdown) {
            return (
                <View style={styles.yearSelector}>
                    <Text style={styles.yearText}>{selectedYear ? selectedYear : translateMessage('Admin.Delivery.App.Calendar.Select.Year')}</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => setIsYearDropdownVisible(!isYearDropdownVisible)}
                style={styles.yearSelector}
            >
                <Text style={styles.yearText}>{selectedYear ? selectedYear :translateMessage('Admin.Delivery.App.Calendar.Select.Year')}</Text>
                <Icon name={isYearDropdownVisible ? 'chevronUp' : 'chevronDown'} size={20} color={theme.colors.themeIcon} />
            </TouchableOpacity>
        )
    }

    function renderButtons() {
        return (
            <>
                {!isYearDropdownVisible ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => handleCloseCalendar()} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>{TranslateMessage('Admin.Delivery.App.Cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                ) :
                    null}
            </>
        )
    }

    function renderCalendarContext() {
        if (!riderName && !riderId) {
            return null;
        }

        return (
            <View style={styles.contextContainer}>
                {riderName ? (
                    <Text style={styles.contextTitle}>
                        {`${TranslateMessage('Admin.Delivery.App.Customer.Driver.Name')}: ${riderName}`}
                    </Text>
                ) : null}
                {riderId ? (
                    <Text style={styles.contextSubtitle}>
                        {`${TranslateMessage('Admin.Delivery.App.Booking.Ride.Status.Ride.DriverId')} ${riderId}`}
                    </Text>
                ) : null}
            </View>
        );
    }

    return (
        <>
            {showIconOnly ? renderIconTrigger() : renderDateField()}
            <Modal visible={isCalendarVisible} transparent>
                <TouchableWithoutFeedback onPress={handleCloseCalendar}>
                    <View style={styles.modalBackground}>

                        <View style={styles.modalContainer}>
                            {renderYearSelector()}
                            {renderCalendarContext()}
                            {!disableYearDropdown && isYearDropdownVisible ? (
                                <View style={{ height: 330 }}>
                                    <FlatList
                                        data={years}
                                        keyExtractor={(item) => item.toString()}
                                        style={styles.yearList}
                                        showsVerticalScrollIndicator={false}
                                        initialScrollIndex={years.findIndex((year) => year === selectedYear)} // 👈 scroll to selected year
                                        getItemLayout={(data, index) => ({
                                            length: 40,         
                                            offset: 40 * index, 
                                            index,
                                        })}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[styles.yearItem, selectedYear === item && styles.selectedYear]}
                                                onPress={() => handleYearSelect(item)}
                                            >
                                                <Text style={[styles.yearItemText, selectedYear === item && { color: theme.colors.textInverse }]}>
                                                    {item}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />

                                </View>
                            ) : (
                                <View style={{ height: 330 }}>
                                    <Calendar
                                        key={calendarDate}
                                        current={calendarDate}
                                        onDayPress={(day: { dateString: string }) => {
                                            setIsYearDropdownVisible(false);
                                            onDateSelect(day.dateString);
                                            setIsCalendarVisible(false);
                                        }}
                                        markedDates={markedDates || (date ? { [String(date)]: { selected: true, marked: true, selectedColor: theme.colors.textErrorDark } } : {})}
                                        maxDate={maxDate}
                                        minDate={minDate}
                                        theme={calendarTheme}
                                    />
                                </View>
                            )}
                            {renderButtons()}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

export default CustomInputDatePicker;
