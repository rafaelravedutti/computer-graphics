﻿#include "cg.h"
#include "thread"

using std::cout;
using std::endl;


CG::CG(int w, int h) : Window(w,h,false)
{


    shaderManager.registerProgram("simple_color", SHADERTYPE_FLAG::VERTEX | SHADERTYPE_FLAG::FRAGMENT);
    shaderManager.registerProgram("wireframe", SHADERTYPE_FLAG::VERTEX | SHADERTYPE_FLAG::FRAGMENT);
    shaderManager.registerProgram("sky", SHADERTYPE_FLAG::VERTEX | SHADERTYPE_FLAG::FRAGMENT);
    shaderManager.registerProgram("plane", SHADERTYPE_FLAG::VERTEX | SHADERTYPE_FLAG::FRAGMENT);
    shaderManager.update();

    teapotMesh.loadFromFile("data/teapot.obj");
    boxMesh.loadFromFile("data/box.obj");


    {
        //create plane mesh
        std::vector<int> indices = {0,1,2,2,3,0};
        std::vector<VertexNT> vertices;

        VertexNT v;
        v.normal = vec4(0,1,0,0);

        v.position = vec4(-1,0,-1,1);
        v.texture = vec2(0,0);
        vertices.push_back(v);
        v.position = vec4(1,0,-1,1);
        v.texture = vec2(1,0);
        vertices.push_back(v);
        v.position = vec4(1,0,1,1);
        v.texture = vec2(1,1);
        vertices.push_back(v);
        v.position = vec4(-1,0,1,1);
        v.texture = vec2(0,1);
        vertices.push_back(v);

        planeMesh.create(vertices,indices,GL_TRIANGLES);
    }


    teapot.currentTransformation.position = vec3(0,0.75,0);
    teapot.currentTransformation.scale = 0.6f;

    plane = glm::scale(vec3(30));

    //    fpscamera.lookAt( vec3(0,2,8), vec3(0,2,0), vec3(0,1,0));
}

CG::~CG()
{
    imgui.shutdown();
}

void CG::update(float dt)
{
    //UPS counter
    auto currentTime = SDL_GetPerformanceCounter();
    double diffS = double(currentTime - lastUpdate) / SDL_GetPerformanceFrequency();
    ups = (1.0 / diffS) * 0.5 + 0.5 * ups; //smooth a little bit
    lastUpdate = currentTime;


    shaderManager.update();

    if(!ImGui::GetIO().WantCaptureMouse)
    {
        fpscamera.updatePosition(dt);

    }



    dt *= timeScale;
    time += dt;

    teapot.update();
    //    teapot.currentTransformation.orientation = normalize(glm::rotate(quat(),time,vec3(0,1,0)));
    teapot.currentTransformation.orientation = Quaternion(vec3(0,1,0),time).normalize();

    //    quat q =  normalize(glm::rotate(quat(),time,vec3(0,1,0)));
    //    cout << q << " " << teapot.currentTransformation.orientation.real << " " << teapot.currentTransformation.orientation.img << endl;

    //    cout << glm::mat4_cast(q) << endl << endl;
    //    cout << teapot.currentTransformation.orientation.toMat4() << endl << endl;

    //    cout << "================================= " << endl;
    box.update();
    box.currentTransformation.position = vec3(-5, glm::sin(time * 0.5 ) * 2 + 2 + 1,0);


    box2.update();
    box2.currentTransformation.position = vec3(5, glm::sin(time * 0.2 ) * 2 + 2 + 1,0);
    //    box2.currentTransformation.orientation = normalize(glm::rotate(quat(),time, normalize(vec3(1,1,1))));
    box2.currentTransformation.orientation = Quaternion(normalize(vec3(1,1,1)),time).normalize();
    box2.currentTransformation.scale = glm::sin(time * 0.3 ) * 0.5 + 0.8;

}

void CG::interpolate(float dt, float alpha)
{

    if(!ImGui::GetIO().WantCaptureMouse)
    {

        fpscamera.updateOrientation(captureMouse);
        fpscamera.interpolate(alpha);
    }

    if(captureMouse)
    {
        SDL_WarpMouseInWindow(sdlWindow,w / 2, h / 2);

        vec2 mp = vec2( float(w / 2), float(h / 2));
        fpscamera.prevMousePosition = mp;
    }

    teapot.interpolate(alpha);
    box.interpolate(alpha);
    box2.interpolate(alpha);
}



void CG::render()
{
    //FPS counter
    auto currentTime = SDL_GetPerformanceCounter();
    double diffS = double(currentTime - lastRender) / SDL_GetPerformanceFrequency();
    fps = (1.0 / diffS) * 0.5 + 0.5 * fps; //smooth a little bit
    lastRender = currentTime;


    glClearColor(0,0,0,0);

    glDepthMask(GL_TRUE);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glEnable(GL_DEPTH_TEST);

    glm::mat4 projView;

    projView = fpscamera.getProjectionMatrix() * inverse(fpscamera.interpolatedTransformation.computeModelMatrix());

    glUseProgram(shaderManager.getProgramGL("simple_color"));
    glUniformMatrix4fv(0, 1, GL_FALSE, &projView[0][0]);
    glUniform3fv(3,1,&lightDir[0]);
    glUniform3fv(4,1,&fpscamera.interpolatedTransformation.position[0]);



    glEnable(GL_POLYGON_OFFSET_FILL);
    glPolygonOffset(1,1);

    //teapot
    glUniform4fv(2,1,&vec4(1,1,0,1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &teapot.interpolatedTransformation.computeModelMatrix()[0][0]);
    teapotMesh.render();


    //box
    glUniform4fv(2,1,&vec4(1,1,0,1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &box.interpolatedTransformation.computeModelMatrix()[0][0]);
    boxMesh.render();

    //box
    glUniform4fv(2,1,&vec4(1,1,0,1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &box2.interpolatedTransformation.computeModelMatrix()[0][0]);
    boxMesh.render();



    glUseProgram(shaderManager.getProgramGL("plane"));
    glUniformMatrix4fv(0, 1, GL_FALSE, &projView[0][0]);
    glUniform3fv(3,1,&lightDir[0]);
    //plane
    glUniform4fv(2,1,&vec4(0.7,0.7,0.7,1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &plane[0][0]);
    planeMesh.render();


    glDisable(GL_POLYGON_OFFSET_FILL);

    vec4 wc1(1,0,0,1);
    vec4 wc2(0,1,0,1);

    if(wireframe)
    {
        glPolygonMode( GL_FRONT_AND_BACK, GL_LINE );
        glUseProgram(shaderManager.getProgramGL("wireframe"));
        glUniformMatrix4fv(0, 1, GL_FALSE, &projView[0][0]);
        glUniform3fv(3,1,&lightDir[0]);

        glUniform4fv(2,1,&wc1[0]);

        glUniformMatrix4fv(1, 1, GL_FALSE, &teapot.lastTransformation.computeModelMatrix()[0][0]);
        teapotMesh.render();
        glUniformMatrix4fv(1, 1, GL_FALSE, &box.lastTransformation.computeModelMatrix()[0][0]);
        boxMesh.render();
        glUniformMatrix4fv(1, 1, GL_FALSE, &box2.lastTransformation.computeModelMatrix()[0][0]);
        boxMesh.render();

        glUniform4fv(2,1,&wc2[0]);

        glUniformMatrix4fv(1, 1, GL_FALSE, &teapot.currentTransformation.computeModelMatrix()[0][0]);
        teapotMesh.render();
        glUniformMatrix4fv(1, 1, GL_FALSE, &box.currentTransformation.computeModelMatrix()[0][0]);
        boxMesh.render();
        glUniformMatrix4fv(1, 1, GL_FALSE, &box2.currentTransformation.computeModelMatrix()[0][0]);
        boxMesh.render();


        glPolygonMode( GL_FRONT_AND_BACK, GL_FILL );
    }

    glUseProgram(shaderManager.getProgramGL("sky"));
    glUniformMatrix4fv(0, 1, GL_FALSE, &projView[0][0]);
    glUniform3fv(1,1,&fpscamera.interpolatedTransformation.position[0]);

    //plane
    glUniform4fv(2,1,&vec4(0.7,0.7,0.7,1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &plane[0][0]);
    planeMesh.render();
}

void CG::renderGui()
{
    ImGui::SetNextWindowPos(ImVec2(0, 0), ImGuiSetCond_FirstUseEver);
    ImGui::SetNextWindowSize(ImVec2(300,400), ImGuiSetCond_FirstUseEver);
    ImGui::Begin("Interpolation");

    ImGui::SliderFloat("timeScale",&timeScale,0,2);

    ImGui::Checkbox("captureMouse (press enter)",&captureMouse);
    ImGui::Checkbox("wireframe",&wireframe);



//    ImGui::SliderInt("updateRate",&updateRate,1,100);
//    ImGui::SliderInt("frameRate",&frameRate,10,1000);
    ImGui::SliderFloat("updateRate",&updateRate,1,200,"%.3f",4.f);
    ImGui::SliderFloat("frameRate",&frameRate,5,10000,"%.3f",4.f);

    ImGui::Text("Interpolation Method");
    const char* names[] = { "None","Interpolate","Extrapolate"};
    ImGui::Combo("IM",&interpolationMethod,names,3);

    ImGui::Separator();

    ImGui::Text("Fps: %f",fps);
    ImGui::Text("Ups: %f",ups);


    ImGui::End();
}

void CG::processEvent(const SDL_Event &event)
{
    if(event.type == SDL_KEYDOWN)
    {
        switch(event.key.keysym.sym)
        {
        case SDLK_RETURN:
            captureMouse = !captureMouse;
            break;
        }
    }
}


void CG::decoupledMainLoop()
{
    Uint64 currentTime = SDL_GetPerformanceCounter();
    Uint64 nextUpdate = currentTime;
    Uint64 nextRender = currentTime;

    // Mainloop
    bool running = true;
    while (running) {

        //Event Processing. Don't touch!
        SDL_Event event;
        while (SDL_PollEvent(&event) > 0) {
            imgui.processEvent(event);
            processEvent(event);
            if (event.type == SDL_QUIT || (event.type == SDL_KEYDOWN && event.key.keysym.sym == SDLK_ESCAPE)) {
                running = false;
                return;
            }
        }

        Uint64 ticksPerUpdate = SDL_GetPerformanceFrequency() / updateRate;
        Uint64 ticksPerRender = SDL_GetPerformanceFrequency() / frameRate;

        currentTime = SDL_GetPerformanceCounter();

	if(nextUpdate < currentTime) {
          nextUpdate += ticksPerUpdate;
          update(1.0 / updateRate);
        }

        if(nextRender < currentTime) {
          nextRender += ticksPerRender;

          //double alpha = mix(0.0, 1.0, nextUpdate - currentTime / (1.0 / frameRate));
          double alpha = 0.4;
        
          // Everything to the "stop" comment counts towards "render".
          if(interpolationMethod == 0) // No interpolation
            alpha = 1;
          else if(interpolationMethod == 1) // Default interpolation: Use your weight
            alpha = alpha;
          else if(interpolationMethod == 2) // Extrapolation: Predict position one timestep in the future
            alpha += 1;

          interpolate(1.0 / frameRate, alpha);
          render();
          imgui.beginFrame();
          renderGui();
          imgui.endFrame();
          SDL_GL_SwapWindow(sdlWindow);
		// stop
        }

	Uint64 waitTime = 0;

        if(currentTime < min(nextUpdate, nextRender)) {
          waitTime = min(nextUpdate, nextRender) - currentTime;
        }

         // Code for sleeping:
        double w = double(waitTime) / SDL_GetPerformanceFrequency();
        std::this_thread::sleep_for( std::chrono::duration<double, std::ratio<1,1>>(w) );

    }

}

