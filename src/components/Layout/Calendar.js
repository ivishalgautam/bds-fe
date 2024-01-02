import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { useQuery } from "@tanstack/react-query";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { Fragment, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calender({
  formattedBatches,
  meetings,
  control,
  handleBatchChange,
  setType,
  openModal,
  setScheduleId,
}) {
  const { user } = useContext(MainContext);

  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  let selectedDayMeetings = meetings?.filter((meeting) =>
    isSameDay(parseISO(meeting.start_time), selectedDay)
  );

  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="mb-10">
          <Controller
            control={control}
            maxMenuHeight={230}
            name="batch"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={formattedBatches}
                onChange={handleBatchChange}
                placeholder="Select batch"
                className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                // menuPortalTarget={document.body}
                menuPosition="absolute"
              />
            )}
          />
        </div>
        {meetings && meetings.length > 0 ? (
          <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200 bg-white p-8 rounded-lg">
            <div className="md:pr-14">
              <div className="flex items-center">
                <h2 className="flex-auto font-semibold text-gray-900">
                  {format(firstDayCurrentMonth, "MMMM yyyy")}
                </h2>
                <button
                  type="button"
                  onClick={previousMonth}
                  className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Previous month</span>
                  <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Next month</span>
                  <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 mt-2 text-sm">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={classNames(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      "py-1.5"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={classNames(
                        isEqual(day, selectedDay) && "text-white",
                        !isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "text-primary",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-900",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-400",
                        isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "bg-primary",
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          "bg-gray-900",
                        !isEqual(day, selectedDay) && "hover:bg-gray-200",
                        (isEqual(day, selectedDay) || isToday(day)) &&
                          "font-semibold",
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </button>

                    <div className="w-1 h-1 mx-auto mt-1">
                      {meetings?.some((meeting) =>
                        isSameDay(parseISO(meeting.start_time), day)
                      ) && (
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <section className="mt-12 md:mt-0 md:pl-14">
              <h2 className="font-semibold text-gray-900">
                Schedule for{" "}
                <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                  {format(selectedDay, "MMM dd, yyy")}
                </time>
              </h2>
              <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                {selectedDayMeetings?.length > 0 ? (
                  selectedDayMeetings.map((meeting) => (
                    <Meeting
                      meeting={meeting}
                      key={meeting.id}
                      user={user}
                      setType={setType}
                      openModal={openModal}
                      setScheduleId={setScheduleId}
                    />
                  ))
                ) : (
                  <p>No meetings for today.</p>
                )}
              </ol>
            </section>
          </div>
        ) : (
          <div className="text-center font-semibold">Select a batch</div>
        )}
      </div>
    </div>
  );
}

function Meeting({ meeting, user, setType, openModal, setScheduleId }) {
  let startDateTime = parseISO(meeting.start_time);
  // let endDateTime = parseISO(meeting.end_time);

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <img
        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${meeting.teacher_image}`}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-auto">
        <p className="text-gray-900">{`${meeting?.teacher_firstname} ${meeting?.teacher_lastname}`}</p>
        <p className="text-gray-900">{`Topic: ${meeting?.schedule_name}`}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.start_time}>
            {format(startDateTime, "h:mm a")}
          </time>{" "}
        </p>
      </div>

      {user?.role !== "student" && (
        <Menu
          as="div"
          className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
        >
          <div>
            <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
              <span className="sr-only">Open options</span>
              <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm w-full"
                      )}
                      onClick={() => {
                        setType("edit");
                        setScheduleId(meeting?.id);
                        openModal();
                      }}
                    >
                      Edit
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </li>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
