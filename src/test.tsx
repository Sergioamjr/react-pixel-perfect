import React from "react";
import ConnectWithUnguessingUI, { UnguessingUI } from ".";
import { mount } from "enzyme";

const mouseEventProperties = new MouseEvent("mousedown", {});

describe("UnguessingUI", () => {
  test("should render ConnectWithUnguessingUI", () => {
    const ToConnect = () => <p>ToConnect</p>;
    const Wrapper = ConnectWithUnguessingUI(ToConnect);
    expect(Wrapper).toHaveLength(1);
  });

  test("should pass all props to target component", () => {
    const props = {
      isLogged: true,
      userName: "admin"
    };
    const ToConnect = () => {
      return <p>ToConnect</p>;
    };
    const App = ConnectWithUnguessingUI(ToConnect);
    const wrapper = mount(<App {...props} />);
    expect(wrapper.find("ToConnect").props()).toEqual(props);
  });
  test("should render UnguessingUI component", () => {
    const wrapper = mount(<UnguessingUI />);
    expect(wrapper).toHaveLength(1);
  });

  test("should render children component", () => {
    const Children = () => <p>Children</p>;
    const wrapper = mount(
      <UnguessingUI>
        <Children />
      </UnguessingUI>
    );
    expect(wrapper.find("Children")).toHaveLength(1);
  });

  test("should open/close component", () => {
    const wrapper = mount(<UnguessingUI />);
    expect(wrapper.find(".input_box_change_status")).toHaveLength(1);
    expect(wrapper.find(".input-box-actived")).toHaveLength(0);
    wrapper.find("#toggle-btn").simulate("click");
    expect(wrapper.find(".input-box-actived")).toHaveLength(1);
  });

  test("should hid/show input box", () => {
    const wrapper = mount(<UnguessingUI />);
    expect(wrapper.find(".input-controll-box")).toHaveLength(0);
    wrapper.setState({ fileName: "file.jpg" });
    expect(wrapper.find(".input-controll-box")).toHaveLength(1);
  });

  test("should show the file name", () => {
    const wrapper = mount(<UnguessingUI />);
    wrapper.setState({ fileName: "file.jpg" });
    expect(wrapper.find("#file-upload-label").text()).toBe("file.jpg selected");
  });

  test("should upload file", () => {
    const wrapper = mount(<UnguessingUI />);
    const instance = wrapper.instance() as UnguessingUI;
    const spy = jest.spyOn(instance, "updateFileHandler");
    wrapper.instance().forceUpdate();
    const file = new Blob([], { type: "image/png" });
    wrapper
      .find("#file-upload")
      .simulate("change", { target: { files: [file] } });
    expect(spy).toHaveBeenCalled();
  });

  test("should return false when upload a non image file", () => {
    const wrapper = mount(<UnguessingUI />);
    const instance = wrapper.instance() as UnguessingUI;
    const spy = jest.spyOn(instance, "updateFileHandler");
    wrapper.instance().forceUpdate();
    const file = new Blob([], { type: "blabla/doc" });
    wrapper
      .find("#file-upload")
      .simulate("change", { target: { files: [file] } });
    expect(spy).toHaveBeenCalled();
    expect(
      instance.updateFileHandler({
        target: { files: [file] }
      })
    ).toBeFalsy();
  });

  test.skip("should change updateTranslateXHandler state", () => {
    const wrapper = mount(<UnguessingUI />);
    wrapper.setState({ fileName: "file.jpg" });
    const instance = wrapper.instance() as UnguessingUI;
    const spy = jest.spyOn(instance, "updateTranslateXHandler");
    wrapper.instance().forceUpdate();
    wrapper.find("#updateTranslateXHandler").simulate("change", {
      target: { value: "10" }
    });
    expect(spy).toHaveBeenCalled();
    expect(wrapper.state("translateX")).toBe(10);
  });
  test.skip("should change updateTranslateYHandler state", () => {
    const wrapper = mount(<UnguessingUI />);
    wrapper.setState({ fileName: "file.jpg" });
    const instance = wrapper.instance() as UnguessingUI;
    const spy = jest.spyOn(instance, "updateTranslateYHandler");
    wrapper.instance().forceUpdate();
    wrapper.find("#updateTranslateYHandler").simulate("change", {
      target: { value: "10" }
    });
    expect(spy).toHaveBeenCalled();
    expect(wrapper.state("translateY")).toBe(10);
  });

  test("should change opacity state", () => {
    const wrapper = mount(<UnguessingUI />);
    wrapper.setState({ fileName: "file.jpg" });
    const instance = wrapper.instance() as UnguessingUI;
    const spy = jest.spyOn(instance, "updateOpacityHandler");
    wrapper.instance().forceUpdate();
    wrapper.find("#updateOpacityHandler").simulate("change", {
      target: { value: "10" }
    });
    expect(spy).toHaveBeenCalled();
    expect(wrapper.state("opacity")).toBe(10 / 100);
  });

  test("should change scale state", () => {
    const wrapper = mount(<UnguessingUI />);
    wrapper.setState({ fileName: "file.jpg" });
    const instance = wrapper.instance() as UnguessingUI;
    const spy = jest.spyOn(instance, "updateScaleHandler");
    wrapper.instance().forceUpdate();
    wrapper.find("#updateScaleHandler").simulate("change", {
      target: { value: "10" }
    });
    expect(spy).toHaveBeenCalled();
    expect(wrapper.state("scale")).toBe(10 / 100);
  });

  test("should reset state", () => {
    const wrapper = mount(<UnguessingUI />);
    wrapper.setState({ fileName: "file.jpg" });
    const instance = wrapper.instance() as UnguessingUI;
    const spy = jest.spyOn(instance, "resetStoreHandler");
    wrapper.instance().forceUpdate();
    wrapper.find(".btn-danger").simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  test("should enable/disabled drag event", () => {
    const wrapper = mount(<UnguessingUI />);
    expect(wrapper.state("enableDrag")).toBeFalsy();
    wrapper.setState({ fileName: "file.jpg" });
    const instance = wrapper.instance() as UnguessingUI;
    const spy = jest.spyOn(instance, "enableDragImage");
    wrapper.instance().forceUpdate();
    wrapper.find(".btn-primary").simulate("click");
    expect(spy).toHaveBeenCalled();
    expect(wrapper.state("enableDrag")).toBeTruthy();
  });

  test("should update mouse coordinates", () => {
    const mockProperties = {
      ...mouseEventProperties,
      pageX: 10,
      pageY: 20
    };
    const wrapper = mount(<UnguessingUI />);
    expect(wrapper.state("mouseX")).toBe(0);
    expect(wrapper.state("mouseY")).toBe(0);
    expect(wrapper.find("#image")).toHaveLength(1);
    const instance = wrapper.instance() as UnguessingUI;
    instance.updateMousePositionToDrag(mockProperties, true);
    expect(wrapper.state("mouseX")).toBe(10);
    expect(wrapper.state("mouseY")).toBe(20);
    instance.updateMousePositionToDrag(mockProperties, false);
    expect(wrapper.state("mouseX")).toBe(0);
    expect(wrapper.state("mouseY")).toBe(0);
  });

  test("should update image position dragging by mouse", () => {
    const mockProperties = {
      ...mouseEventProperties,
      pageX: 115,
      pageY: 222
    };
    const wrapper = mount(<UnguessingUI />);
    wrapper.setState({
      dragByMouse: true,
      enableDrag: true,
      mouseX: 100,
      mouseY: 200
    });
    expect(wrapper.state("translateX")).toBe(0);
    expect(wrapper.state("translateY")).toBe(0);
    expect(wrapper.state("mouseX")).toBe(100);
    expect(wrapper.state("mouseY")).toBe(200);
    const instance = wrapper.instance() as UnguessingUI;
    instance.updateBackgroundPositionByHand(mockProperties);
    expect(wrapper.state("translateX")).toBe(115 - 100);
    expect(wrapper.state("translateY")).toBe(222 - 200);
    expect(wrapper.state("mouseX")).toBe(100 + 115 - 100);
    expect(wrapper.state("mouseY")).toBe(200 + 222 - 200);
  });
});
