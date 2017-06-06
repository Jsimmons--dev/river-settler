import { UI } from '../public/js/ui/ui';
import { LifecycleManager } from '../public/js/lifecycle/LifecycleManager';
import { BaseUI } from '../public/js/ui/BaseUI';
import { StartUI } from '../public/js/ui/StartUI';
import { GameUI } from '../public/js/ui/GameUI';
import { NewGameUI } from '../public/js/ui/NewGameUI';
import { OptionsUI } from '../public/js/ui/OptionsUI';
import { Controller } from '../public/js/controllers/Controller';
import { ControllerFactory } from '../public/js/controllers/ControllerFactory';

describe('The UI system', function(){
    it('cannot instantiate abstract UI',function(){
        expect(function(){new BaseUI()}).toThrow();
    });
    it('cannot instantate abstract Controller', function(){
        expect(function(){new Controller()}).toThrow(); 
    });
    it('ensures that all UIs get created',function(){
        let ui = new UI();

        let uiMap = ui.uiFactory.uiMap;
        expect(uiMap.start instanceof StartUI).toEqual(true);
        expect(uiMap.options instanceof OptionsUI).toEqual(true);
        expect(uiMap['new'] instanceof NewGameUI).toEqual(true);
        expect(uiMap.game instanceof GameUI).toEqual(true);
    });
});

describe('The Lifecycle System', function(){
    it('calls the visit function when the ui navigates', function(){
        let ui = new UI();

        spyOn(ui.lifecycleManager, 'visit');

        ui.navigate('start');
        
        expect(ui.lifecycleManager.visit).toHaveBeenCalled();
    });
    it('calls the StartController OnLanding and OnVisit the first time it is navigated to', function(){
        let ui = new UI();

        let startController = ui.controllerFactory.controllerMap.start;
        console.log(startController.OnLanding);

        spyOn(startController, 'OnLanding');
        spyOn(startController, 'OnVisit');

        ui.navigate('start');

        expect(startController.OnLanding.calls.count()).toEqual(1);
        expect(startController.OnVisit.calls.count()).toEqual(1);
        
        expect(startController.OnLanding).toHaveBeenCalled();
        expect(startController.OnVisit).toHaveBeenCalled();
    });
    it('only calls OnLanding once and calls OnVisit on subsequent visits', function(){
        let ui = new UI();

        let startController = ui.controllerFactory.controllerMap.start;

        spyOn(startController, 'OnLanding');
        spyOn(startController, 'OnVisit');

        ui.navigate('start');
        ui.navigate('start');

        expect(startController.OnLanding.calls.count()).toEqual(1);
        expect(startController.OnVisit.calls.count()).toEqual(2);
    });
});

