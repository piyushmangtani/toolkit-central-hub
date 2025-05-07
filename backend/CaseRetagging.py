
def process_data(file_path):
    import os
    import pandas as pd
    from selenium import webdriver
    from selenium.webdriver.common.keys import Keys
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException
    from selenium.webdriver.common.by import By
    from selenium.webdriver.edge.service import Service
    from selenium.webdriver.edge.options import Options
    from time import sleep
    import time
    import datetime
    import os
    import shutil
    import subprocess
    import zipfile
    import urllib3
    import requests

    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    #finding the case modification excel

    script_dir = os.path.abspath(os.path.dirname(__file__))
    edgelocationfolder = os.path.join(script_dir,"Edge Webdriver")
    edgelocation = os.path.join(edgelocationfolder,"msedgedriver.exe")
    caseexcel = os.path.join(file_path)
    global logfilelocation
    global status
    logfilelocation = os.path.join(script_dir,"Logbook.txt")

    file = open(logfilelocation,"w")
    file.close()

    #disabling console log

    op = Options()
    op.add_experimental_option('excludeSwitches', ['enable-logging'])

    #initializing webdriver version check 


    def download_and_extract_edge_driver(loc):
        
        print("Checking for the latest edge webdriver")
        try:
            command = 'wmic datafile where name="C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe" get Version /value'
            # Run the command and capture the output
            result = subprocess.run(command, stdout=subprocess.PIPE, text=True, shell=True)
            striptext = result.stdout.strip()
            currentversion = striptext[len("Version:"):].lstrip()
            #print(currentversion)

        except: 
            print("Failed to find the recent version of Edge")
            return

        # URL of the zip file
        url = "https://msedgedriver.azureedge.net/" + str(currentversion) + "/edgedriver_win64.zip"

        # Folder to save and extract the zip file
        folder_name = loc

        # Create the folder if it doesn't exist
        if not os.path.exists(folder_name):
            os.makedirs(folder_name)

        # File path for saving the zip file
        zip_file_path = os.path.join(folder_name, "edgedriver_win64.zip")

        # Download the zip file
        try:

            response = requests.get(url, verify=False)
            with open(zip_file_path, "wb") as f:
                f.write(response.content)

            # Extract the zip file
            with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
                zip_ref.extractall(folder_name)

            # Delete the zip file
            os.remove(zip_file_path)
            
            drivernotesfolder = os.path.join(folder_name, "driver_notes")
            
            try:
            # Delete the folder and all its contents
                shutil.rmtree(drivernotesfolder)
            except Exception as e:
                print("Error deleting driver notes folder")
        
            print("Edge driver downloaded and extracted")

        except:
            print("Failed to download and extract the latest edge version")

    # Call the edge driver version function to execute the code
    download_and_extract_edge_driver(edgelocationfolder)

    #runtime

    start = time.time()

    #initializing the web driver

    service = Service(executable_path=edgelocation)
    driver = webdriver.Edge(service=service, options=op)

    #reading excel sheet

    df = pd.read_excel(caseexcel)
    casecode = df["Case Code"].tolist()
    prmindustry = df["Add Primary Industry"].tolist()
    isc = df["Add Supported/Commercial Industry"].tolist()
    secindustry = df["Add Secondary Industry"].tolist()
    prmcapability = df["Add Primary Capability"].tolist()
    csc = df["Add Supported/Commercial Capability"].tolist()
    seccapability = df["Add Secondary Capability"].tolist()
    newkeyword = df["Add Keyword"].tolist()
    removeindustry = df["Remove Industry"].tolist()
    removecapabilitiy = df["Remove Capability"].tolist()
    removekeyword = df["Remove Keyword"].tolist()
    #newstate = df["State"].tolist()
    newnote = df["Notes"].tolist()

    rows = len(casecode)

    #function to clean data

    def cleandata():

        for a in range(len(casecode)):
            #casecode[a] = str(casecode[a]).encode('ascii', errors='ignore').decode()
            casecode[a] = str(casecode[a]).strip().lower() 

        for b in range(len(prmindustry)):
            #prmindustry[b] = str(prmindustry[b]).encode('ascii', errors='ignore').decode()
            prmindustry[b] = str(prmindustry[b]).strip().lower()
            
        for c in range(len(isc)):
            #isc[c] = str(isc[c]).encode('ascii', errors='ignore').decode()
            isc[c] = str(isc[c]).strip().lower()
            
        for d in range(len(secindustry)):
            #secindustry[d] = str(secindustry[d]).encode('ascii', errors='ignore').decode()
            secindustry[d] = str(secindustry[d]).strip().lower()

        for e in range(len(prmcapability)):
            #prmcapability[e] = str(prmcapability[e]).encode('ascii', errors='ignore').decode()
            prmcapability[e] = str(prmcapability[e]).strip().lower()
            
        for f in range(len(csc)):
            #csc[f] = str(csc[f]).encode('ascii', errors='ignore').decode()
            csc[f] = str(csc[f]).strip().lower()
            
        for g in range(len(seccapability)):
            #seccapability[g] = str(seccapability[g]).encode('ascii', errors='ignore').decode()
            seccapability[g] = str(seccapability[g]).strip().lower()
            
        for h in range(len(newkeyword)):
            #newkeyword[h] = str(newkeyword[h]).encode('ascii', errors='ignore').decode()
            newkeyword[h] = str(newkeyword[h]).strip().lower()   

        for i in range(len(removeindustry)):
            #removeindustry[i] = str(removeindustry[i]).encode('ascii', errors='ignore').decode()
            removeindustry[i] = str(removeindustry[i]).strip().lower()   

        for j in range(len(removecapabilitiy)):
            #removecapabilitiy[j] = str(removecapabilitiy[j]).encode('ascii', errors='ignore').decode()
            removecapabilitiy[j] = str(removecapabilitiy[j]).strip().lower()   
            
        for k in range(len(removekeyword)):
            #removekeyword[k] = str(removekeyword[k]).encode('ascii', errors='ignore').decode()
            removekeyword[k] = str(removekeyword[k]).strip().lower()  

        for l in range(len(newnote)):
            newnote[l] = str(newnote[l]).encode('ascii', errors='ignore').decode()                                   

    #function to add keyword

    def addkeyword(key):

        currentkeyword()

        try:
            b=keywords.index(key)
            print("Keyword already present : ", key)
            
        except ValueError:

            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//span[contains(text(),\'Keywords & Tools')]")))
            keyword_button = driver.find_element(By.XPATH, ".//span[contains(text(),\'Keywords & Tools')]") #finding keyword section
            driver.execute_script("arguments[0].click();", keyword_button) #clicking on keyword section
        
            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//section[@class='taxonomy']/mat-accordion/app-taxonomy-search-tree[4]/mat-expansion-panel/div")))    
            key_input_div = driver.find_element(By.XPATH, ".//section[@class='taxonomy']/mat-accordion/app-taxonomy-search-tree[4]/mat-expansion-panel/div") #finding input div
            key_button = key_input_div.find_element(By.XPATH, './/input') #finding input box

            key_button.send_keys(key) #typing keyword in the box
            keyword_click = driver.find_element(By.XPATH, ".//app-checkbox[@class='item-without-alignment tree-item']/div/input") #finding keyword div
            driver.execute_script("arguments[0].click();", keyword_click) #selecting the keyword
        
            key_button.clear()
            for i in range(2):
                key_button.send_keys(Keys.BACKSPACE)
        
            driver.execute_script("arguments[0].click();", keyword_button) #close the tab
            print("New Keyword Added : ", key)
        
    #function to add industry    

    def addindustry(ind):

        currentindustry()

        try:
            b=industry.index(ind)
            print("Industry already present : ", ind)
            global status
            status = "present"

        except ValueError:
            
            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//section[@class='taxonomy']/mat-accordion/app-taxonomy-search-tree[1]")))
            ind_button = driver.find_element(By.XPATH, ".//section[@class='taxonomy']/mat-accordion/app-taxonomy-search-tree[1]") #finding the industry section
            ind_click = ind_button.find_element(By.XPATH, ".//span")
            driver.execute_script("arguments[0].click();", ind_click) #clicking on the industry section
        
            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//input")))
            ind_input = ind_button.find_element(By.XPATH, ".//input") #finding input div   
            ind_input.send_keys(ind) #typing the industry in the box
        
            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//app-checkbox[@class='item-without-alignment tree-item']/div/input")))    
            select_ind = driver.find_element(By.XPATH, ".//app-checkbox[@class='item-without-alignment tree-item']/div")
            
            valueselected = select_ind.text.lower()

            if (str(ind) == str(valueselected)): #checking if industry name entered is right
                select_ind = driver.find_element(By.XPATH, ".//app-checkbox[@class='item-without-alignment tree-item']/div/input")
                driver.execute_script("arguments[0].click();", select_ind) #selecting the industry keyword
                status = "industry added"
        
            else:
                status = "wrong industry"
                print("Industry " + ind.upper() + " is wrong. Please enter a valid industry name")    

            ind_input.clear()
            for i in range(2):
                ind_input.send_keys(Keys.BACKSPACE)
    
            driver.execute_script("arguments[0].click();", ind_click) #clicking on the industry section
        return status

    #function to add capability

    def addcapability(cap):
        
        currentcapability()

        try:
            b=capability.index(cap)
            print("Capability already present : ", cap)
            global status
            status = "present"

        except ValueError:

            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//section[@class='taxonomy']/mat-accordion/app-taxonomy-search-tree[2]")))
            cap_button = driver.find_element(By.XPATH, ".//section[@class='taxonomy']/mat-accordion/app-taxonomy-search-tree[2]") #finding the capability section
            cap_click  = cap_button.find_element(By.XPATH, ".//span")
            driver.execute_script("arguments[0].click();", cap_click) #clicking on the capability section

            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//input")))
            cap_button1 = cap_button.find_element(By.XPATH, './/input') #finding input box
            cap_button1.send_keys(cap) #typing the industry in the box
        
            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//app-checkbox[@class='item-without-alignment tree-item']/div/input")))
            cap_click1 = driver.find_element(By.XPATH, ".//app-checkbox[@class='item-without-alignment tree-item']/div/input") #finding capability div
            driver.execute_script("arguments[0].click();", cap_click1) #selecting the capability keyword
        
            cap_button1.clear()
            for i in range(2):
                cap_button1.send_keys(Keys.BACKSPACE)
        
            driver.execute_script("arguments[0].click();", cap_click) #clicking on the capability section

    #function to add notes 

    def addnotes(notes):
        
        myElem = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, "//app-admin-accordion[@title='Notes']")))
        find_notes = driver.find_element(By.XPATH, "//app-admin-accordion[@title='Notes']") #finding notes section    
        edit_notes = find_notes.find_element(By.XPATH, ".//i[@class='icon icon--Edit icon--red ng-star-inserted']") #opening notes section
        driver.execute_script("arguments[0].click();", edit_notes)
        
        myElem = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, ".//a[@class='link']")))
        addnew = driver.find_element(By.XPATH, ".//a[@class='link']") #finding add new section
        driver.execute_script("arguments[0].click();", addnew) #clicking on add new section
        
        myElem = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, ".//div[@class='admin-edit-note__item']")))
        dropdown = driver.find_element(By.XPATH, ".//div[@class='dropdown-container']") #finding add new section
        driver.execute_script("arguments[0].click();", dropdown)

        myElem = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, ".//option[contains(text(),\'General')]")))
        select_state = driver.find_element(By.XPATH, ".//option[contains(text(),\'General')]").click() #clicking the state
    
        myElem = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, ".//div[@class='admin-edit-note__item']")))
        text_area = driver.find_element(By.XPATH, "//textarea[@formcontrolname='description']").send_keys(notes)
            
        save = driver.find_element(By.XPATH, ".//a[contains(text(),\'Save')]")
        driver.execute_script("arguments[0].click();", save) #clicking on add new section
        
        myElem = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, ".//button[@class='button']")))    
        submit = driver.find_element(By.XPATH, ".//button[contains(text(),\'Submit')]")
        driver.execute_script("arguments[0].click();", submit) #clicking on add new section
        
        myElem = WebDriverWait(driver, 20).until(EC.invisibility_of_element_located((By.XPATH, ".//a[@class='link']")))

    #function to click on taxonomy button    

    def taxonomyclick():  
        
        myElem = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, "//app-admin-accordion[@title='Taxonomy (TAGS)']")))
        find_taxonomy = driver.find_element(By.XPATH, "//app-admin-accordion[@title='Taxonomy (TAGS)']") #finding Taxonomy Tag button
        edit_taxonomy = find_taxonomy.find_element(By.XPATH, ".//i[@class='icon icon--Edit icon--red ng-star-inserted']") #opening Taxonomy Tag Button
        driver.execute_script("arguments[0].click();", edit_taxonomy)
        
        try:
            myElem = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.XPATH, ".//section[@class='taxonomy']/mat-accordion/app-taxonomy-search-tree[1]")))
            #print("Taxonomy Tab is ready!")
        except TimeoutException:
            print ("Taxonomy Tab - Loading took too much time!")

    #function to add industry and make it primary

    def primaryindustry(ind):
        
        currentindustry()

        if(str(ind)!=str(industry[0])):

            try:
                b=industry.index(ind)
            except ValueError:
                addindustry(ind)
            
            currentindustry()
            index = industry.index(ind)
            i = index + 1
        
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-0']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[1]/div/app-chips/div[" + str(i) + "]/div/i[1]")
                driver.execute_script("arguments[0].click();", finding_tag)
            except:
                pass
            
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-1']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[1]/div/app-chips/div[" + str(i) + "]/div/i[1]")
                driver.execute_script("arguments[0].click();", finding_tag)  
            except:    
                pass
            
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-2']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[1]/div/app-chips/div[" + str(i) + "]/div/i[1]")
                driver.execute_script("arguments[0].click();", finding_tag)
            except:    
                pass

            print("New Primary Industry : " + ind)

        else:
            print("Primary Industry already present for : " + ind)

    #function to add capability and make it primary

    def primarycapability(cap):
        
        currentcapability()

        if(str(cap)!=str(capability[0])):

            try:
                b=capability.index(cap)
            except ValueError:
                addcapability(cap)
            
            currentcapability()
            index = capability.index(cap)
            i = index + 1
        
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-0']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[2]/div/app-chips/div[" + str(i) + "]/div/i[1]")
                driver.execute_script("arguments[0].click();", finding_tag)
            except:
                pass
            
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-1']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[2]/div/app-chips/div[" + str(i) + "]/div/i[1]")
                driver.execute_script("arguments[0].click();", finding_tag)  
            except:    
                pass
            
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-2']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[2]/div/app-chips/div[" + str(i) + "]/div/i[1]")
                driver.execute_script("arguments[0].click();", finding_tag)
            except:    
                pass

            print("New Primary Capability : " + cap)

        else:
            print("Primary Capability already present for : " + cap)


    #function to add industry commercial term

    def industrycommercial(ind):
        
        currentindustry()
        try:
            b=industry.index(ind)
        except:
            addindustry(ind)
            
        currentindustry()
        index = industry.index(ind)
        i = index + 1
        
        try:
            finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-0']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[1]/div/app-chips/div[" + str(i) + "]/div/i[2]")
            driver.execute_script("arguments[0].click();", finding_tag)
            #print("cdk-overlay 0 working")
        except:
            pass
            
        try:
            finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-1']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[1]/div/app-chips/div[" + str(i) + "]/div/i[2]")
            driver.execute_script("arguments[0].click();", finding_tag)
            #print("cdk-overlay 1 working")
        except:    
            pass
            
        try:
            finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-2']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[1]/div/app-chips/div[" + str(i) + "]/div/i[2]")
            driver.execute_script("arguments[0].click();", finding_tag)   
            #print("cdk-overlay 2 working")
        except:    
            pass    

    #function to add capability commercial term    

    def capabilitycommercial(cap):
        
        currentcapability()
        try:
            b=capability.index(cap)
        except ValueError:
            addcapability(cap)
            
        currentcapability()
        index = capability.index(cap)
        i = index + 1
        
        try:
            finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-0']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[2]/div/app-chips/div[" + str(i) + "]/div/i[2]")
            driver.execute_script("arguments[0].click();", finding_tag)
            #print("cdk-overlay 0 working")
        except:
            pass
            
        try:
            finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-1']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[2]/div/app-chips/div[" + str(i) + "]/div/i[2]")
            driver.execute_script("arguments[0].click();", finding_tag)
            #print("cdk-overlay 1 working")
        except:    
            pass
            
        try:
            finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-2']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[2]/div/app-chips/div[" + str(i) + "]/div/i[2]")
            driver.execute_script("arguments[0].click();", finding_tag)   
            #print("cdk-overlay 2 working")
        except:    
            pass 

    #function to get a list of added industry terms    

    def currentindustry():
        parent_div = driver.find_element(By.XPATH, "//app-chips[@primarytitle='Primary (main)']")
        count_of_divs = len(parent_div.find_elements(By.XPATH, "./div"))
    
        global industry
        industry = []

        for i in range(count_of_divs):  
            i = i +1
            try:
                find_industry = driver.find_element(By.XPATH, "//app-chips[@primarytitle='Primary (main)']/div["+ str(i) +"]/div/div")
                industry.append(find_industry.text.lower())
            except:
                pass    

    #function to get a list of added capability terms

    def currentcapability():
        parent_div = driver.find_element(By.XPATH, "//app-chips[@primarytitle='Primary (delivery)']")
        count_of_divs = len(parent_div.find_elements(By.XPATH, "./div"))
    
        global capability
        capability = []

        for i in range(count_of_divs):  
            i = i +1
            try:
                find_capability = driver.find_element(By.XPATH, "//app-chips[@primarytitle='Primary (delivery)']/div["+ str(i) +"]/div/div")
                capability.append(find_capability.text.lower())
            except:    
                pass

    #function to get a list of added keyword terms

    def currentkeyword():
        
        parent_div = driver.find_element(By.XPATH,"//article[@class='keywords']/div/app-chips")
        count_of_divs = len(parent_div.find_elements(By.XPATH, "./div"))
        #print(count_of_divs)
    
        global keywords
        keywords = []

        #print(keywords)
        for i in range(count_of_divs):  
            i = i + 1
            try:
                find_keyword = driver.find_element(By.XPATH, "//article[@class='keywords']/div/app-chips/div["+ str(i) +"]/div/div")
                keywords.append(find_keyword.text.lower())
            except:
                pass
        
    #function to remove industry term    

    def removingindustry(ind):
        
        currentindustry()
        try:
            index = industry.index(ind)
            i = index + 1
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-0']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[1]/div/app-chips/div[" + str(i) + "]/div/a/i")
                driver.execute_script("arguments[0].click();", finding_tag)
                #print("cdk-overlay 0 working")
            except:
                pass
            
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-1']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[1]/div/app-chips/div[" + str(i) + "]/div/a/i")
                driver.execute_script("arguments[0].click();", finding_tag)  
                #print("cdk-overlay 1 working")
            except:    
                pass
            
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-2']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[1]/div/app-chips/div[" + str(i) + "]/div/a/i")
                driver.execute_script("arguments[0].click();", finding_tag)
                #print("cdk-overlay 2 working")
            except:    
                pass
            print("Industry Removed : " + ind)
        except:
            print("Industry not present : " + ind)

    #function to remove capability term

    def removingcapability(cap):

        currentcapability()

        try:
            index = capability.index(cap)
            i = index + 1
        
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-0']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[2]/div/app-chips/div[" + str(i) + "]/div/a/i")
                driver.execute_script("arguments[0].click();", finding_tag)
            except:
                pass
            
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-1']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[2]/div/app-chips/div[" + str(i) + "]/div/a/i")
                driver.execute_script("arguments[0].click();", finding_tag)  
            except:    
                pass
            
            try:
                finding_tag = driver.find_element(By.XPATH, "//*[@id='cdk-overlay-2']/ng-component/main/section/app-admin-edit-taxonomy/main/div[2]/section[2]/article[2]/div/app-chips/div[" + str(i) + "]/div/a/i")
                driver.execute_script("arguments[0].click();", finding_tag)
            except:    
                pass
            print("Capability Removed : " + cap)
        except:
            print("Capability not present : " + cap)

    #function to remove keyword term

    def removingkeyword(key):
        
        myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//span[contains(text(),\'Keywords & Tools')]")))

        keyword_button = driver.find_element(By.XPATH, ".//span[contains(text(),\'Keywords & Tools')]") #finding keyword section
        driver.execute_script("arguments[0].click();", keyword_button) #clicking on keyword section
            
        key_input_div = driver.find_element(By.XPATH, ".//section[@class='taxonomy']/mat-accordion/app-taxonomy-search-tree[4]/mat-expansion-panel/div") #finding input div
        key_button = key_input_div.find_element(By.XPATH, './/input') #finding input box

        key_button.send_keys(key) #typing keyword in the box
        
        keyword_click = driver.find_element(By.XPATH, ".//app-checkbox[@class='item-without-alignment tree-item']/div/input") #finding keyword div
        driver.execute_script("arguments[0].click();", keyword_click) #selecting the keyword
        
        key_button.clear()
        for i in range(2):
            key_button.send_keys(Keys.BACKSPACE)
        
        driver.execute_script("arguments[0].click();", keyword_button) #close the tab
        print("Keyword Removed:", key)

    #function to check supported industry

    def checksupportedind():

        try:
            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//article[@class='industry']")))
            icon = myElem.find_element(By.XPATH,".//i[@class='icon icon--red icon--Commercial-Supported chips__icons ng-star-inserted']")
            icondiv = icon.find_element(By.XPATH, "..")
            return icondiv.text

        except:
            return "no supported industry"

    def checksupportedcap():

        try:
            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//article[@class='capability']")))
            icon = myElem.find_element(By.XPATH,".//i[@class='icon icon--red icon--Commercial-Supported chips__icons ng-star-inserted']")
            icondiv = icon.find_element(By.XPATH, "..")
            return icondiv.text

        except:
            return "no supported capability"    

    #function to save taxonomy   

    def save():

        myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, ".//button[contains(text(),\'Save')]")))
        save_button = driver.find_element(By.XPATH, ".//button[contains(text(),\'Save')]") #clicking on save
        driver.execute_script("arguments[0].click();", save_button)
        myElem = WebDriverWait(driver, 20).until(EC.invisibility_of_element_located((By.XPATH, ".//section[@class='taxonomy']")))

    def botlog(case):

        ct = datetime.datetime.now()
        currentindustry()
        currentcapability()
        currentkeyword()

        ind = " "
        cap = " "
        key = " "

        for x in range(len(industry)):
            ind = ind + str(industry[x]) + ";"

        for y in range(len(capability)):
            cap = cap + str(capability[y]) + ";"

        for z in range(len(keywords)):
            key = key + str(keywords[z]) + ";"
    
        file = open(logfilelocation,"a")
        file.writelines(str(ct))
        file.writelines(" ")
        file.writelines(str(case))
        file.writelines(ind)
        file.writelines(cap)
        file.writelines(key)
        file.writelines("\n")
        file.writelines("\n")
        file.close() #to change file access modes    

    ###############################################################################################################################
    """

    Bot Initialization

    """
    ###############################################################################################################################

    print("=============================================================")
    print("                                                             ")
    print("Welcome to IRIS RETAGGING BOT")
    print("                                                             ")
    print("Please wait while the bot is initializing.")
    print("                                                             ")
    print("=============================================================")

    cleandata()

    sleep(1)
        
    #loop for modifying all cases
    for i in range(rows):
        
        status = ""

        URL = "https://iris.bain.com/powertool/content/" + str(casecode[i]) + "?type=Case"
        driver.get(URL) #calling the URL
        try:
            myElem = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, "//app-admin-accordion[@title='Taxonomy (TAGS)']")))
            print("              ")

        except TimeoutException:
            print ("Opening Page - Loading took too much time!")
        
        casecounter = i + 1

        print("===============================================")
        print(str(casecounter) + ") Working on case code: " + casecode[i])
        print("===============================================")
        print("              ")

        #running all the functions
        taxonomyclick()
        
        if(prmindustry[i]!='nan'):
            primaryindustry(prmindustry[i])
        
        if(isc[i]!='nan'):
            currentvalue = checksupportedind()
            currentindustry()

            if(str(isc[i]) != str(industry[0])):
                if (isc[i] != currentvalue.lower()):
                    industrycommercial(isc[i])
                    print("New Supported/Commercial Industry : " + isc[i])
                else:
                    print("Supported/Commercial Industry already present for : " + isc[i])
            else:
                print("Cannot add " + isc[i].upper() + " as Supported/Commercial Industry cannot be same as Primary Industry. Please add a different Supported Industry or Primary Industry.")

        if(secindustry[i]!='nan'):
            status = ""
            funcvalue = addindustry(secindustry[i])
            if(funcvalue == "industry added"): 
                print("New Secondary Industry added : ", secindustry[i])
        
        if(prmcapability[i]!='nan'):
            primarycapability(prmcapability[i])
        
        if(csc[i]!='nan'):
            currentvalue = checksupportedcap()
            if(csc[i] != currentvalue.lower()):
                capabilitycommercial(csc[i])
                print("New Supported/Commercial Capability : " + csc[i])
            else:
                print("Supported/Commercial Capability already present for :" + csc[i])   
        
        if(seccapability[i]!='nan'):
            status = ""
            addcapability(seccapability[i])
            if(status!="present"):
                print("New Secondary Capability Added : ", seccapability[i])
        
        if(newkeyword[i]!='nan'):
            addkeyword(newkeyword[i])

        if(removeindustry[i]!='nan'):
            currentindustry()

        if (str(removeindustry[i]) != str(industry[0])):    
            removingindustry(removeindustry[i])
        else:
            print("Can't remove " + removeindustry[i].upper() + " because it's a primary industry. If you want to remove it, please provide a different primary industry first.")

        
        if(removecapabilitiy[i]!='nan'):    
            currentcapability()
            
            if(str(removecapabilitiy[i]) != str(capability[0])):
                removingcapability(removecapabilitiy[i])
            else:
                print("Can't remove " + removecapabilitiy[i].upper() + " because it's a primary capability. If you want to remove it, please provide a different primary capability first.")
        
        if(removekeyword[i]!='nan'):    
            currentkeyword()
            try:
                b = keywords.index(removekeyword[i])
                removingkeyword(removekeyword[i])
            except ValueError:
                pass

        botlog(casecode[i])         

        save()

        if(newnote[i]!='nan'):  
            addnotes(newnote[i])
            print("Notes Added : " + newnote[i])

    end = time.time()

    print("                         ")
    print("----------------------------------------------------")
    print("The bot has ended running")
    print("The time of execution of above program is :" + str(round((end-start),0)) + " seconds")

    msg = str(rows) + " Cases re-tagged in " + str(round(end-start)) + " seconds"

    return {"message": "Running"}